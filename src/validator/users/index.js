import UserPayloadScheme from './schema.js';
import InvariantError from '../../exceptions/InvariantError.js';

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UserValidator;
