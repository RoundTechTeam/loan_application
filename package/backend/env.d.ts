declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'prod' | 'dev';

    DATABASE_URL: string;

    JWT_SECRET: string;
  }
}
