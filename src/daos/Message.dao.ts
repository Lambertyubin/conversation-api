import { PrismaClient, Message } from "@prisma/client";
import DatabaseClient from "../clients/Database.client";
import { ConversationChannel } from "../interfaces/enums/ConversationChannel.enum";
import { getChannel } from "../helpers/helpers";

export class MessageDao {
  constructor(private _dbClient: PrismaClient = DatabaseClient.getInstance()) {}
  public async createMessage(
    message: string,
    response: string,
    channel: ConversationChannel,
    conversationId: string
  ): Promise<Message> {
    return await this._dbClient.message.create({
      data: {
        message,
        response,
        conversationId,
        channel: getChannel(channel),
      },
    });
  }
}

export default new MessageDao();
