const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    host: '0.0.0.0',
    port: 9000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();

  // console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
