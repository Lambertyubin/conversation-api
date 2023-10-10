import "dotenv/config";
import App from "./app";
import conversationImportRoute from "./routes/ConversationImport.route";

(async () => {
  const app = new App([conversationImportRoute]);
  await app.initializeApp();
  await app.listen();
})().catch((err: any) => {
  // log error to Sentry
  process.exit(1);
});
