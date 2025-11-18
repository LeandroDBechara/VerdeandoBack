import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),
  PORT: Joi.number().default(9000),
  DATABASE_URL: Joi.string().required(),
  NEWS_API_KEY: Joi.string().required(),
  
  // Mailjet (optional - only needed for email features)
  MAILJET_API_KEY: Joi.string().optional(),
  MAILJET_SECRET_KEY: Joi.string().optional(),
  EMAIL_SENDER: Joi.string().optional(),
  BACKOFFICE_RESET_PASSWORD_URL: Joi.string().optional(),
  
  // AWS (optional - only needed for file storage features)
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().optional(),
  AWS_BUCKET: Joi.string().optional(),
});
