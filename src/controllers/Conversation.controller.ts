import { IRequest } from "src/interfaces/IRequest.interface";
import conversationService, {
  ConversationService,
} from "../services/Conversation.service";
import { Response, NextFunction } from "express";
import logger from "../utils/logger";

export class ConversationController {
  constructor(
    private readonly _conversationService: ConversationService = conversationService
  ) {}

  public getAllConversations = async (
    req: IRequest<any>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info("fetching list of conversations");
      const paginationParams = req.pagination;
      const conversations = await this._conversationService.getAllConversations(
        paginationParams
      );
      res.status(200).send(conversations);
    } catch (err: any) {
      logger.error(err);
      next(err);
    }
  };

  public getMessagesByConversation = async (
    req: IRequest<any>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const conversationId = req.params.id;
      if (!conversationId) {
        res.status(400).send("Must provide the id of the conversation");
        return;
      }
      logger.info(
        `fetching messages for conversation with id ${conversationId}conversations`
      );
      const paginationParams = req.pagination;
      const messages =
        await this._conversationService.getMessagesByConversation(
          conversationId,
          paginationParams
        );
      res.status(200).send(messages);
    } catch (err: any) {
      logger.error(err);
      next(err);
    }
  };
}

export default new ConversationController();
