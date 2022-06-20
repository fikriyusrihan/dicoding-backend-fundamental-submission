import InvariantError from '../../exceptions/InvariantError.js';
import {
  PostAuthenticationsPayloadScheme,
  PutAuthenticationsPayloadScheme,
  DeleteAuthenticationsPayloadScheme,
} from './schema.js';

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult =
      DeleteAuthenticationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AuthenticationsValidator;
