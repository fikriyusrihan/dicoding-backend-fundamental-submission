import AlbumsHandler from './handler.js';
import routes from './routes.js';

const albumsPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {albumsService, storageService, validator}) => {
    const albumHandler =
      new AlbumsHandler(albumsService, storageService, validator);
    server.route(routes(albumHandler));
  },
};

export default albumsPlugin;
