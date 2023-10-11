import "dotenv/config";
import App from "./app";
import conversationImportRoute from "./routes/ConversationImport.route";
import conversationRoute from "./routes/Conversation.route";
import logger from "./utils/logger";

(async () => {
  const app = new App([conversationImportRoute, conversationRoute]);
  await app.initializeApp();
  await app.listen();
})().catch((err: any) => {
  logger.error(err);
  process.exit(1);
});
