import InvariantError from '../../exceptions/InvariantError.js';
import {
  PlaylistsPayloadScheme,
  SongsPlaylistPayloadScheme,
} from './schema.js';

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongPlaylistPayload: (payload) => {
    const validationResult = SongsPlaylistPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default PlaylistsValidator;
