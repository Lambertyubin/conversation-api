import { IRequest } from "../interfaces/IRequest.interface";
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
}

export default new ConversationController();
