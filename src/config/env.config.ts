import 'dotenv/config';

const {
  PORT,
  DB_URI,
  NODE_ENV,
  JWT_SECRET,
  USD_RESERVE,
  NGN_RESERVE,
  ADMIN_PASSWORD,
  ADMIN_EMAIL,
} = process.env;

const ENV = Object.freeze({
  PORT: Number.parseInt(PORT),
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  USD_RESERVE,
  NGN_RESERVE,
  ADMIN_PASSWORD,
  ADMIN_EMAIL,
});

if (!ENV.DB_URI) {
  throw new Error('DB_URI is missing in environment variables.');
}

export default ENV;
