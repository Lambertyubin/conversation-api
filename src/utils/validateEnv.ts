import { cleanEnv, port, str, url } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    APP_ENV: str(),
    NODE_ENV: str(),
    PORT: port(),
    AWS_BUCKET_NAME: str(),
  });
}

export default validateEnv;
