require("dotenv").config();

const Hapi = require("@hapi/hapi");
const songs = require("./api/songs");
const albums = require("./api/albums");
const SongsService = require("./services/postgres/SongsService");
const SongsValidator = require("./validator/songs");
const AlbumsService = require("./services/postgres/AlbumsService");
const AlbumsValidator = require("./validator/albums");

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
