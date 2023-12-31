require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./service/NotesServices');
const NotesValidator = require('./validator/notes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: '127.0.0.1',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register({
    plugin: notes,
    options: {
      service: new NotesService(),
      validator: NotesValidator,
    },
  });
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();