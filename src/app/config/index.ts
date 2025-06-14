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
  sslcommerz_store_id: process.env.SSL_STORE_ID,
  sslcommerz_api_key: process.env.SSL_API_SECRET,
  ssl_redairect_url: process.env.SSL_REDIRECT_URL,
  frontend_dev_url: process.env.FRONTEND_DEV_URL,
  frontend_prodution_url: process.env.FRONTEND_PRODUTIONS_URL,
};
