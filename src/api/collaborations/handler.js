/* eslint-disable require-jsdoc */
import ClientError from '../../exceptions/ClientError.js';

class CollaborationsHandler {
  constructor(
      collaborationsService,
      playlistsService,
      usersService,
      validator,
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const {id: credentialId} = request.auth.credentials;
      const {playlistId, userId} = request.payload;

      await this._playlistsService.verifyPlaylistOwner(
          playlistId, credentialId,
      );

      await this._usersService.getUserById(userId);

      const collaborationId =
        await this._collaborationsService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const {id: credentialId} = request.auth.credentials;
      const {playlistId, userId} = request.payload;

      await this._playlistsService.verifyPlaylistOwner(
          playlistId, credentialId,
      );
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(response);
      return response;
    }
  }
}

export default CollaborationsHandler;
