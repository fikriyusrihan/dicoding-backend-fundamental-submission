import routes from './routes.js';
import SongHandler from './handler.js';

const songPlugin = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  },
};

export default songPlugin;
