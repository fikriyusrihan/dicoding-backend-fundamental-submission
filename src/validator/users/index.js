import UsersPayloadScheme from './schema.js';
import InvariantError from '../../exceptions/InvariantError.js';

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UsersPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UsersValidator;
