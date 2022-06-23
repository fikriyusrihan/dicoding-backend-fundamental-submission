import Joi from 'joi';

const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});

export default ExportPlaylistPayloadSchema;
