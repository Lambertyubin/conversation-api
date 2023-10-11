import { PrismaClient, Conversation } from "@prisma/client";
import DatabaseClient from "../clients/Database.client";

export class ConversationDao {
  constructor(private _dbClient: PrismaClient = DatabaseClient.getInstance()) {}
  public async findConversation(
    sender: string,
    receiver: string
  ): Promise<Conversation | null> {
    return await this._dbClient.conversation.findFirst({
      where: { senderUsername: sender, receiverUsername: receiver },
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
}

export default new ConversationDao();
