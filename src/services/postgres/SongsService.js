const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        insertedAt,
        updatedAt,
      ],
    };
    console.log(query.values);
    const resultQuery = await this._pool.query(query);

    if (!resultQuery.rows[0].id) {
      throw new InvariantError("Failed to add the song");
    }

    return resultQuery.rows[0].id;
  }

  async getSongs() {
    const resultQuery = await this._pool.query(
      "SELECT id, title, performer FROM songs"
    );
    return resultQuery.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const resultQuery = await this._pool.query(query);

    if (!resultQuery.rows.length) {
      throw new NotFoundError("Song not found");
    }

    return resultQuery.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id",
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const resultQuery = await this._pool.query(query);

    if (!resultQuery.rows.length) {
      throw new NotFoundError("Failed to update the song. Id not found.");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const resultQuery = await this._pool.query(query);

    if (!resultQuery.rows.length) {
      throw new NotFoundError("Failed to delete the song. Id not found.");
    }
  }
}

module.exports = SongsService;
