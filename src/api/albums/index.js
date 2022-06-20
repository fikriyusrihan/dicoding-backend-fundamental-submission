import AlbumHandler from './handler.js';
import routes from './routes.js';

const albumPlugin = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(routes(albumHandler));
  },
};

export default albumPlugin;
