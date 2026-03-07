import 'dotenv/config';
import { get } from 'env-var';

const NODE_ENV = get('NODE_ENV').required().asEnum(['development', 'production', 'test']);

const getEnv  = () => {

  if (NODE_ENV === 'production' || NODE_ENV === 'test') return {};

  return {
    POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
    POSTGRES_USER: get('POSTGRES_USER').required().asString(),
    POSTGRES_DB: get('POSTGRES_DB').required().asString(),
    MACHINE_ID: get('MACHINE_ID').required().asIntPositive()
  }
}

export const env = {
    NODE_ENV,
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    PORT: get('PORT').required().asPortNumber(),

    ...getEnv ()
}