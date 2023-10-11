import { Conversation, Message } from "@prisma/client";
import conversationDao, { ConversationDao } from "../daos/Conversation.dao";
import { Pagination } from "../interfaces/Pagination.interface";

export class ConversationService {
  constructor(
    private readonly _conversationDao: ConversationDao = conversationDao
  ) {}

  public async getConversationId(
    sender: string,
    receiver: string
  ): Promise<string> {
    let conversation: Conversation | null;
    conversation = await this.findConversation(sender, receiver);

    if (!conversation) {
      conversation = await this.findConversation(receiver, sender);
    }
    if (!conversation) {
      conversation = await this.createConversation(sender, receiver);
    }
    if (!conversation?.id) {
      throw new Error("couln't get or create a conversation");
    }
    return conversation.id;
  }

  public async getAllConversations(
    paginationParams: Pagination | undefined
  ): Promise<Conversation[] | null> {
    return await this._conversationDao.getAllConversations(paginationParams);
  }
  public async getMessagesByConversation(
    conversationId: string,
    paginationParams: Pagination | undefined
  ): Promise<Message[] | null> {
    return await this._conversationDao.getMessagesByConversation(
      conversationId,
      paginationParams
    );
  }

  private async findConversation(
    sender: string,
    receiver: string
  ): Promise<Conversation | null> {
    return await this._conversationDao.findConversation(sender, receiver);
  }

  private async createConversation(
    sender: string,
    receiver: string
  ): Promise<Conversation | null> {
    return await this._conversationDao.createConversation(sender, receiver);
  }
}

export default new ConversationService();
