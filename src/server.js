import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';

// Albums plugin
import albums from './api/albums/index.js';
import AlbumService from './services/postgres/AlbumService.js';
import AlbumValidator from './validator/albums/index.js';

// Songs plugin
import songs from './api/songs/index.js';
import SongService from './services/postgres/SongService.js';
import SongValidator from './validator/songs/index.js';

// Users plugin
import users from './api/users/index.js';
import UsersService from './services/postgres/UsersService.js';
import UserValidator from './validator/users/index.js';

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
