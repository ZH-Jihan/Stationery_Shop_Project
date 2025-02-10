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
};
