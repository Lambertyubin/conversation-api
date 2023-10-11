import { ConversationChannel } from "src/interfaces/enums/ConversationChannel.enum";
import messageDao, { MessageDao } from "../daos/Message.dao";
import { Message } from "@prisma/client";

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
}

export default new MessageService();
