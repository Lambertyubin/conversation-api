import { PrismaClient, Message } from "@prisma/client";
import DatabaseClient from "../clients/Database.client";
import { ConversationChannel } from "../interfaces/enums/ConversationChannel.enum";
import { getChannel } from "../helpers/helpers";
import { Pagination } from "../interfaces/Pagination.interface";

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

  public async getMessagesByConversation(
    conversationId: string,
    paginationParams?: Pagination
  ): Promise<Message[]> {
    return await this._dbClient.message.findMany({
      where: {
        conversationId,
      },
      skip: paginationParams?.skip,
      take: paginationParams?.limit,
    });
  }
}

export default new MessageDao();
