const Joi = require('joi');
     
const NotePayloadSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required(),
  body: Joi.string().required(),
});
 
module.exports = { NotePayloadSchema };