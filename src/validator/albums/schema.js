import Joi from 'joi';

const AlbumPayloadScheme = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export default AlbumPayloadScheme;
