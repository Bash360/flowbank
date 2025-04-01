import 'dotenv/config';

const {
  PORT,
  DB_URI,
  NODE_ENV,
  JWT_SECRET,
  FLOW_BANK_USD_ACCOUNT,
  FLOW_BANK_NGN_ACCOUNT,
} = process.env;

const ENV = Object.freeze({
  PORT: Number.parseInt(PORT),
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  FLOW_BANK_USD_ACCOUNT,
  FLOW_BANK_NGN_ACCOUNT,
});

if (!ENV.DB_URI) {
  throw new Error('DB_URI is missing in environment variables.');
}

export default ENV;
