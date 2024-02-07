const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }
  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return queryResult.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN albums ON albums.id=songs."albumId" WHERE albums.id=$1',
      values: [id],
    };
    const queryResultAlbum = await this._pool.query(queryAlbum);
    const queryResultSong = await this._pool.query(querySong);

    if (!fetchAlbum.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
    return {
      id: queryResultAlbum.rows[0].id,
      name: queryResultAlbum.rows[0].name,
      year: queryResultAlbum.rows[0].year,
      songs: queryResultSong.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };
    const queryResult = await this._pool.query(query);

    if (!queryResult.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}
module.exports = AlbumsService;
