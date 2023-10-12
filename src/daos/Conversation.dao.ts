import { PrismaClient, Conversation, Message } from "@prisma/client";
import DatabaseClient from "../clients/Database.client";
import { Pagination } from "../interfaces/Pagination.interface";

export class ConversationDao {
  constructor(private _dbClient: PrismaClient = DatabaseClient.getInstance()) {}

  public async findConversation(
    sender: string,
    receiver: string
  ): Promise<Conversation | null> {
    return await this._dbClient.conversation.findFirst({
      where: {
        OR: [
          { senderUsername: sender, receiverUsername: receiver },
          { senderUsername: receiver, receiverUsername: sender },
        ],
      },
    });
  }

  public async createConversation(
    sender: string,
    receiver: string
  ): Promise<Conversation | null> {
    return await this._dbClient.conversation.create({
      data: { senderUsername: sender, receiverUsername: receiver },
    });
  }

  public async getAllConversations(
    paginationParams?: Pagination
  ): Promise<Conversation[] | null> {
    return await this._dbClient.conversation.findMany({
      skip: paginationParams?.skip,
      take: paginationParams?.limit,
    });
  }

  public async getMessagesByConversation(
    conversationId: string,
    paginationParams?: Pagination
  ): Promise<Message[] | null> {
    return await this._dbClient.message.findMany({
      where: {
        conversationId,
      },
      skip: paginationParams?.skip,
      take: paginationParams?.limit,
    });
  }
}

export default new ConversationDao();
