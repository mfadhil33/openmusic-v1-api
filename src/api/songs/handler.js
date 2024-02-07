const ClientError = require("../../exceptions/ClientError");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // Agar this nya merujuk pada instance dari NotesService bukan object route
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, performer, genre, duration } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        performer,
        genre,
        duration,
      });

      const res = h.response({
        status: "success",
        message: "Song added successfully.",
        data: {
          songId,
        },
      });
      res.code(201);
      return res;
    } catch (err) {
      // client error
      if (err instanceof ClientError) {
        const res = h.response({
          status: "fail",
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }

      // Server ERROR!
      const res = h.response({
        status: "Error",
        message: "Sorry, there was a failure on our server.",
      });
      res.code(500);
      console.error(err);
      return res;
    }
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: "success",
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: {
          song,
        },
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const res = h.response({
          status: "fail",
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }

      // Server ERROR!
      const res = h.response({
        status: "error",
        message: "Sorry, there was a failure on our server",
      });
      res.code(500);
      console.error(err);
      return res;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;

      await this._service.editSongById(id, request.payload);

      return {
        status: "success",
        message: "Song successfully updated",
      };
    } catch (err) {
      //client error
      if (err instanceof ClientError) {
        const res = h.response({
          status: "fail",
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }

      // Server ERROR!
      const res = h.response({
        status: "error",
        message: "Sorry, there was a failure on our server.",
      });
      res.code(500);
      console.error(err);
      return res;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: "success",
        message: "Successfully Deleted Song.",
      };
    } catch (err) {
      // client error
      if (err instanceof ClientError) {
        const res = h.response({
          status: "fail",
          message: err.message,
        });
        res.code(err.statusCode);
        return res;
      }

      // Server ERROR!
      const res = h.response({
        status: "Error",
        message: "Sorry, there was a failure on our server",
      });
      res.code(500);
      console.error(err);
      return res;
    }
  }
}

module.exports = SongsHandler;
