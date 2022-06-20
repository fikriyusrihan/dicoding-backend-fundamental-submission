import InvariantError from '../../exceptions/InvariantError.js';
import AlbumPayloadScheme from './schema.js';

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AlbumValidator;
