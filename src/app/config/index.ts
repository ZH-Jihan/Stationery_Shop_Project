import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  database_name: process.env.DATABASE_NAME,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  access_token_expire: process.env.ACCESS_TOKEN_EXPIRY,
  refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRY,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_AIP_KEY,
  cloud_api_secret: process.env.CLOUD_AIP_SECRET,
  sp_endpoint: process.env.SP_ENDPOINT,
  sp_username: process.env.SP_USERNAME,
  sp_password: process.env.SP_PASSWORD,
  sp_prefix: process.env.SP_PREFIX,
  sp_return_url: process.env.SP_RETURN_URL,
  frontend_dev_url: process.env.FRONTEND_DEV_URL,
  frontend_prodution_url: process.env.FRONTEND_PRODUTIONS_URL,
};
