import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

export class BasicAuthorizer implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    return AuthorizationDecision.ALLOW;
  }
}

// Voter - compare account id to determine accessibility
export async function compareAccountId(
  context: AuthorizationContext,
): Promise<AuthorizationDecision> {
  switch (context.invocationContext.targetClass.name) {
    case 'AccountController':
      break;
    case 'ApplicationController':
      break;
    case 'ApplicationuserController':
      break;
    case 'AccountApplicationController':
      break;
    case 'ApplicationApplicationuserController':
      break;
  }

  let currentUser: UserProfile;

  if (context.principals.length > 0) {
    const user = _.pick(context.principals[0], ['id', 'name']);
    currentUser = {[securityId]: user.id, name: user.name};
  } else {
    return AuthorizationDecision.DENY;
  }

  const test = _.find(context.invocationContext.args, {
    accountId: currentUser[securityId],
  });
  console.log(test);

  if (currentUser[securityId] === context.invocationContext.args[0]) {
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}
