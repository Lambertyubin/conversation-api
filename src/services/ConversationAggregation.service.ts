import { extractContent, extractRecords } from "../helpers/helpers";
import awsClient, { AWSClient } from "../clients/AWS.client";
import responseInferenceService, {
  ResponseInferenceService,
} from "./ResponseInference.service";
import { ConversationChannel } from "../interfaces/enums/ConversationChannel.enum";
import conversationService, {
  ConversationService,
} from "./Conversation.service";
import messageService, { MessageService } from "./Message.service";

export class ConversationAggregationService {
  constructor(
    private readonly _awsClient: AWSClient = awsClient,
    private readonly _responseInferenceService: ResponseInferenceService = responseInferenceService,
    private readonly _conversationService: ConversationService = conversationService,
    private readonly _messageService: MessageService = messageService
  ) {}
  public async aggregate(sourceFileKey: string | undefined): Promise<void> {
    if (sourceFileKey) {
      const fileContent = await this._awsClient.downloadFileFromS3(
        sourceFileKey
      );
      const records = extractRecords(fileContent);
      const contents = extractContent(records);

      for (const [sender, receiver, message, channel] of contents) {
        const inferredResponse =
          await this._responseInferenceService.inferResponse(
            message,
            channel as ConversationChannel
          );

        let conversationId = await this._conversationService.getConversationId(
          sender,
          receiver
        );

        const personalizedResponse = this.personalizeResponse(
          inferredResponse,
          sender
        );

        await this._messageService.createMessage(
          message,
          personalizedResponse,
          channel as ConversationChannel,
          conversationId
        );
      }
    }
  }

  private personalizeResponse(response: string, senderName: string): string {
    return response.replaceAll("{{sender_username}}", senderName);
  }
}
export default new ConversationAggregationService();
