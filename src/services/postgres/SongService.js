/* eslint-disable quotes */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {nanoid} from 'nanoid';
import pg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';

const {Pool} = pg;

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Musik gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let text = "SELECT id, title, performer FROM songs";
    const values = [];

    if (title) {
      text = text + " WHERE title ILIKE '%' || $1 || '%'";
      values.push(title);
    }

    if (!title && performer) {
      text = text + " WHERE performer ILIKE '%' || $1 || '%'";
      values.push(performer);
    }

    if (title && performer) {
      text = text + " AND performer ILIKE '%' || $2 || '%'";
      values.push(performer);
    }

    const query = {
      text: text,
      values: values,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(id, {title, year, genre, performer, duration, albumId}) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui musik. Id tidak ditemukan.');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Musik gagal dihapus. Id tidak ditemukan.');
    }
  }
}

export default SongService;
