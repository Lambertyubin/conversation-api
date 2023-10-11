import { Router } from "express";
import { Route } from "../interfaces/Route.interface";
import { requireAuthentication } from "../middlewares/Auth.middleware";
import { validationMiddleware } from "../middlewares/Validation.middleware";
import conversationController from "../controllers/Conversation.controller";
import { paginationMiddleware } from "../middlewares/Pagination.middleware";

class ConversationRoute implements Route {
  path = "/conversation";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/:id/chat`,
      requireAuthentication,
      paginationMiddleware(),
      conversationController.getMessagesByConversation
    );

    this.router.get(
      `${this.path}/`,
      requireAuthentication,
      paginationMiddleware(),
      conversationController.getAllConversations
    );
  }
}

export default new ConversationRoute();
