import "dotenv/config";
import App from "./app";
import conversationImportRoute from "./routes/ConversationImport.route";
import conversationRoute from "./routes/Conversation.route";

(async () => {
  const app = new App([conversationImportRoute, conversationRoute]);
  await app.initializeApp();
  await app.listen();
})().catch((err: any) => {
  // log error to Sentry
  process.exit(1);
});
