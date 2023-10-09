import { cleanEnv, port, str, url } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    APP_ENV: str(),
    NODE_ENV: str(),
    PORT: port(),
  });
}

export default validateEnv;
