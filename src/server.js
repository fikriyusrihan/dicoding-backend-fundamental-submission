import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';

// Albums plugin
import albums from './api/albums/index.js';
import AlbumsService from './services/postgres/AlbumsService.js';
import AlbumsValidator from './validator/albums/index.js';

// Songs plugin
import songs from './api/songs/index.js';
import SongsService from './services/postgres/SongsService.js';
import SongsValidator from './validator/songs/index.js';

// Users plugin
import users from './api/users/index.js';
import UsersService from './services/postgres/UsersService.js';
import UsersValidator from './validator/users/index.js';

// Authentication plugin
import authentications from './api/authentications/index.js';
import AuthenticationsValidator from './validator/authentications/index.js';
import AuthenticationsService
  from './services/postgres/AuthenticationsService.js';
import TokenManager from './tokenize/TokenManager.js';

// Playlists plugin
import playlists from './api/playlists/index.js';
import PlaylistsValidator from './validator/playlists/index.js';
import PlaylistsService from './services/postgres/PlaylistsService.js';

// Collaborations plugin
import collaborations from './api/collaborations/index.js';
import CollaborationsValidator from './validator/collaborations/index.js';
import CollaborationsService
  from './services/postgres/CollaborationsService.js';

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // External plugins registration
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Definition of JWT authentication
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
