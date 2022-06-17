import InvariantError from '../../exceptions/InvariantError.js';
import SongPayloadScheme from './schema.js';

const SongValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongValidator;
