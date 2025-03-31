import 'dotenv/config';

const { PORT, DB_URI, NODE_ENV } = process.env;

const ENV = Object.freeze({ PORT: Number.parseInt(PORT), NODE_ENV, DB_URI });

if (!ENV.DB_URI) {
  throw new Error('DB_URI is missing in environment variables.');
}

export default ENV;
