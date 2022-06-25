import InvariantError from '../../exceptions/InvariantError.js';
import {AlbumsPayloadScheme, AlbumImageCoverHeadersSchema} from './schema.js';

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateAlbumCoverHeaders: (headers) => {
    const validationResult = AlbumImageCoverHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AlbumsValidator;
