import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {
  ApplicationRepository,
  ApplicationuserRepository,
} from '../repositories';

export class BasicAuthorizer implements Provider<Authorizer> {
  @repository(ApplicationRepository) appRepo: ApplicationRepository;
  @repository(ApplicationuserRepository) appUserRepo: ApplicationuserRepository;

  value(): Authorizer {
    return this.authorize.bind(this);
  }

  // Global authorisation policy
  // This method will be invoked for all protected routes
  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const currentUser: UserProfile | null = this.getUserProfile(context);

    // Deny access if user is not found
    if (!currentUser) {
      return AuthorizationDecision.DENY;
    }

    // Deny access if user does not have a role
    if (!currentUser.role) {
      return AuthorizationDecision.DENY;
    }

    // Allow access to admin role
    if (currentUser.role === 'admin') return AuthorizationDecision.ALLOW;

    // Allow access if user role is allowed for that endpoint
    if (!metadata.allowedRoles!.includes(currentUser.role))
      return AuthorizationDecision.DENY;

    // Check if models belong to current user
    // Because of our current api routes design, have to resort to this hacky authorisation solution
    switch (context.invocationContext.targetClass.name) {
      case 'AccountController':
        if (this.checkAccountIdInParam(currentUser, context))
          return AuthorizationDecision.ALLOW;
        break;

      case 'ApplicationController':
        if (
          (await this.checkApplicationIdInParam(currentUser, context)) ||
          this.checkAccountIdInRequest(currentUser, context)
        )
          return AuthorizationDecision.ALLOW;
        break;

      case 'ApplicationuserController':
        if (
          (await this.checkApplicationIdInRequest(currentUser, context)) ||
          (await this.checkApplicationuserIdInParam(currentUser, context))
        )
          return AuthorizationDecision.ALLOW;
        break;

      case 'AccountApplicationController':
        if (this.checkAccountIdInParam(currentUser, context))
          return AuthorizationDecision.ALLOW;
        break;

      case 'ApplicationApplicationUserController':
        if (await this.checkApplicationIdInParam(currentUser, context))
          return AuthorizationDecision.ALLOW;
        break;
    }

    // Deny access if all the conditions above do not met
    return AuthorizationDecision.DENY;
  }

  // Fetch account information
  getUserProfile(context: AuthorizationContext) {
    let currentUser: UserProfile | null = null;

    if (context.principals.length > 0) {
      const user = _.pick(context.principals[0], ['id', 'name', 'role']);
      currentUser = {[securityId]: user.id, name: user.name, role: user.role};
    }

    return currentUser;
  }

  checkAccountIdInParam(
    currentUser: UserProfile,
    context: AuthorizationContext,
  ): boolean {
    // Exit when account id does not exist in parameter
    if (context.invocationContext.args[0] instanceof Object) return false;

    // Compare account id from param with current user id
    if (Number(currentUser[securityId]) === context.invocationContext.args[0])
      return true;

    return false;
  }

  async checkApplicationIdInParam(
    currentUser: UserProfile,
    context: AuthorizationContext,
  ): Promise<boolean> {
    // Get appId from param
    const appId = context.invocationContext.args[0];

    // Exit when application id does not exist in parameter
    if (appId instanceof Object) return false;

    // Check if app exists for that id
    // If it doesn't exists, return true to throw 404 error instead of 401 error
    const appExists = await this.appRepo.findOne({
      where: {
        id: appId,
      },
    });
    if (!appExists) return true;

    // Check if the app is owned by current user
    // app is null if it's not owned by current user
    const app = await this.appRepo.findOne({
      where: {
        id: appId,
        accountId: Number(currentUser[securityId]),
      },
    });

    return !!app;
  }

  checkAccountIdInRequest(
    currentUser: UserProfile,
    context: AuthorizationContext,
  ): boolean {
    // Get the request body that contains account id
    const req = _.find(context.invocationContext.args, o => o.accountId);

    if (!req) return false;
    // Compare account id from the request body with current user id
    if (req.accountId === Number(currentUser[securityId])) return true;

    return false;
  }

  async checkApplicationIdInRequest(
    currentUser: UserProfile,
    context: AuthorizationContext,
  ): Promise<boolean> {
    // Get the request body that contains application id
    const req = _.find(context.invocationContext.args, o => o?.applicationId);

    if (!req) return false;

    // Check if the app is owned by current user
    // app is null if it's not owned by current user
    const app = await this.appRepo.findOne({
      where: {
        id: req.applicationId,
        accountId: Number(currentUser[securityId]),
      },
    });

    return !!app;
  }

  async checkApplicationuserIdInParam(
    currentUser: UserProfile,
    context: AuthorizationContext,
  ): Promise<boolean> {
    // Get appUserId from param
    const appUserId = context.invocationContext.args[0];

    // Exit when appUserId does not exist in parameter
    if (appUserId instanceof Object) return false;

    // Get appId from appUserId
    const appId = (await this.appUserRepo.findById(appUserId)).applicationId;

    if (!appId) return false;

    // Check if the app is owned by current user
    // If the app is not owned by current user, app is null
    const app = await this.appRepo.findOne({
      where: {
        id: appId,
        accountId: Number(currentUser[securityId]),
      },
    });

    return !!app;
  }
}
