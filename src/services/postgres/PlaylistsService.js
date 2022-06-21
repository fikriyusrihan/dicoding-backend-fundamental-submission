/* eslint-disable require-jsdoc */
import pg from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

const {Pool} = pg;

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({name, owner}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username
      FROM playlists p
      INNER JOIN users u 
      ON p.owner = u.id
      WHERE p.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan.');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_item-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal ditambahkan kedalam playlist');
    }
  }

  async getPlaylistSongsById(owner, playlistId) {
    await this.verifyPlaylistOwner(playlistId, owner);

    const queryGetPlaylist = {
      text: `SELECT p.id, p.name, u.username
      FROM playlists p
      INNER JOIN users u
      ON p.owner = u.id
      WHERE p.id = $1`,
      values: [playlistId],
    };

    const queryGetSongs = {
      text: `SELECT s.id, s.title, s.performer
      FROM songs s
      INNER JOIN playlist_songs p 
      ON p.song_id = s.id
      WHERE p.playlist_id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(queryGetPlaylist);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songsResult = await this._pool.query(queryGetSongs);

    const playlist = playlistResult.rows[0];
    const result = {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsResult.rows,
    };

    return result;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlist_songs 
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak memiliki akses resource ini');
    }
  }
}

export default PlaylistsService;
