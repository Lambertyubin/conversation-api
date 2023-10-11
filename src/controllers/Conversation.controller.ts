import { IRequest } from "src/interfaces/IRequest.interface";
import conversationService, {
  ConversationService,
} from "../services/Conversation.service";
import { Response, NextFunction } from "express";

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
      const paginationParams = req.pagination;
      const conversations = await this._conversationService.getAllConversations(
        paginationParams
      );
      res.status(200).send(conversations);
    } catch (err: any) {
      // log to Sentry
      next(err);
    }
  };
}

export default new ConversationController();
