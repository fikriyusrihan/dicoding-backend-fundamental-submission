/* eslint-disable require-jsdoc */
import ClientError from '../../exceptions/ClientError.js';

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postPlaylistSongByIdHandler =
      this.postPlaylistSongByIdHandler.bind(this);

    this.getPlaylistSongsByIdHandler =
      this.getPlaylistSongsByIdHandler.bind(this);

    this.deletePlaylistSongsByIdHandler =
      this.deletePlaylistSongsByIdHandler.bind(this);

    this.getPlaylistActivitiesByIdHandler =
      this.getPlaylistActivitiesByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);

      const {name} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      const playlistId =
        await this._playlistsService.addPlaylist(name, credentialId);

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
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

  async getPlaylistsHandler(request, h) {
    try {
      const {id: credentialId} = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists,
        },
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
      console.error(error);
      return response;
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.deletePlaylist(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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
      console.error(error);
      return response;
    }
  }

  async postPlaylistSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);

      const {songId} = request.payload;
      const {id: playlistId} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._songsService.getSongById(songId);
      await this._playlistsService.verifyPlaylistAccess(
          playlistId, credentialId,
      );
      await this._playlistsService.addSongToPlaylist(playlistId, songId);
      await this._playlistsService.addActivity(
          playlistId, songId, credentialId, 'add',
      );

      const response = h.response({
        status: 'success',
        message: 'Musik berhasil ditambahkan ke dalam playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
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

  async getPlaylistSongsByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;
      const playlist =
        await this._playlistsService.getPlaylistSongsById(id, credentialId);

      return {
        status: 'success',
        data: {
          playlist,
        },
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
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongsByIdHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);

      const {id} = request.params;
      const {songId} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      await this._playlistsService.deleteSongFromPlaylist(id, songId);
      await this._playlistsService.addActivity(
          id, songId, credentialId, 'delete',
      );

      return {
        status: 'success',
        message: 'Musik berhasil dihapus dari playlist',
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
      console.error(error);
      return response;
    }
  }

  async getPlaylistActivitiesByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);

      const activities =
        await this._playlistsService.getPlaylistActivitiesById(id);

      return {
        status: 'success',
        data: {
          playlistId: id,
          activities,
        },
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
      console.error(error);
      return response;
    }
  }
}

export default PlaylistsHandler;
