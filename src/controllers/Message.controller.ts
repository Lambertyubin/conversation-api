import { IRequest } from "src/interfaces/IRequest.interface";
import { Response, NextFunction } from "express";
import logger from "../utils/logger";
import messageService, { MessageService } from "../services/Message.service";

export class MessageController {
  constructor(
    private readonly _messageService: MessageService = messageService
  ) {}

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
      const messages = await this._messageService.getMessagesByConversation(
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

export default new MessageController();
