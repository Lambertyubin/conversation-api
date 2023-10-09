import "dotenv/config";
import App from "./app";
import { Router } from "express";

(async () => {
  const app = new App([{ path: "/any", router: Router() }]);
  await app.initializeApp();
  await app.listen();
})().catch((err: any) => {
  // log error to Sentry
  process.exit(1);
});
