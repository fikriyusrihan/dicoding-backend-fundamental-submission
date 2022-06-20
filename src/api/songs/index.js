import routes from './routes.js';
import SongsHandler from './handler.js';

const songsPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const songHandler = new SongsHandler(service, validator);
    server.route(routes(songHandler));
  },
};

export default songsPlugin;
