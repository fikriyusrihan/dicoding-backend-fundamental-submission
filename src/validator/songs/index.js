import InvariantError from '../../exceptions/InvariantError.js';
import SongsPayloadScheme from './schema.js';

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongsValidator;
