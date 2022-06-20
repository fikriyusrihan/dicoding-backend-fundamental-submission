import Joi from 'joi';

const AlbumsPayloadScheme = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export default AlbumsPayloadScheme;
