import {
  Authorizer,
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {UserProfile, securityId} from '@loopback/security';
import _ from 'lodash';

export class BasicAuthorizer implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    context: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    // CAN BE USED FOR FUTURE IMPLEMENTATION OF ROLES (Admin, Support, Customer)

    return AuthorizationDecision.ALLOW;
  }
}

// Voter - compare account id to determine accessibility
export async function compareAccountId(
  context: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  let currentUser: UserProfile;

  if (context.principals.length > 0) {
    const user = _.pick(context.principals[0], ['id', 'name']);
    currentUser = {[securityId]: user.id, name: user.name};
  } else {
    return AuthorizationDecision.DENY;
  }

  if (currentUser[securityId] === context.invocationContext.args[0]) {
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}
