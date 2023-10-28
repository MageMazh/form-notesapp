const NotesHandler = require('./handler');
const routes = require('./routes');
const NotesService = require('../../service/NotesServices');
 
module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notesHandler = new NotesHandler(new NotesService());
    server.route(routes(notesHandler));
  },
};