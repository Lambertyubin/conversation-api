import { ConversationChannel } from "../interfaces/enums/ConversationChannel.enum";
import messageDao, { MessageDao } from "../daos/Message.dao";
import { Message } from "@prisma/client";
import { Pagination } from "../interfaces/Pagination.interface";

export class MessageService {
  constructor(private readonly _messageDao: MessageDao = messageDao) {}
  public async createMessage(
    message: string,
    response: string,
    channel: ConversationChannel,
    conversationId: string
  ): Promise<Message> {
    return await this._messageDao.createMessage(
      message,
      response,
      channel,
      conversationId
    );
  }

  public async getMessagesByConversation(
    conversationId: string,
    paginationParams?: Pagination
  ): Promise<Message[]> {
    return await this._messageDao.getMessagesByConversation(
      conversationId,
      paginationParams
    );
  }
}

export default new MessageService();
