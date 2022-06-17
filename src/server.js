import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';
import albums from './api/albums/index.js';
import AlbumService from './services/postgres/AlbumService.js';
import AlbumValidator from './validator/albums/index.js';

const init = async () => {
  const albumService = new AlbumService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
