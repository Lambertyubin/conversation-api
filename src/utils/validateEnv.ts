import { cleanEnv, port, str, url } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    APP_ENV: str(),
    NODE_ENV: str(),
    PORT: port(),
    AWS_BUCKET_NAME: str(),
    AWS_ACCESS_KEY: str(),
    AWS_SECRET_KEY: str(),
    AWS_BUCKET_REGION: str(),
    AWS_QUEUE_URL: str(),
    DATABASE_URL: str(),
  });
}

export default validateEnv;
