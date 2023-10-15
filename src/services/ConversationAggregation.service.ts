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
import logger from "../utils/logger";

const SENDER_USERNAME_PLACEHOLDER = "{{sender_username}}";
const RECEIVER_USERNAME_PLACEHOLDER = "{{receiver_username}}";
export class ConversationAggregationService {
  constructor(
    private readonly _awsClient: AWSClient = awsClient,
    private readonly _responseInferenceService: ResponseInferenceService = responseInferenceService,
    private readonly _conversationService: ConversationService = conversationService,
    private readonly _messageService: MessageService = messageService
  ) {}
  public async aggregate(sourceFileKey: string): Promise<void> {
    logger.info("fetching file from S3 bucket");
    const fileContent = await this._awsClient.downloadFileFromS3(sourceFileKey);
    const records = extractRecords(fileContent);
    const contents = extractContent(records);

    logger.info(
      "processing each message - inferring response from predefined responses, saving conversations, and messages"
    );
    for (const [sender, receiver, message, channel] of contents) {
      const inferredResponse =
        await this._responseInferenceService.inferResponse(
          message,
          channel as ConversationChannel
        );

      if (inferredResponse) {
        let conversationId = await this._conversationService.getConversationId(
          sender,
          receiver
        );

        const personalizedResponse = this.personalizeResponse(
          inferredResponse,
          sender,
          receiver
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

  private personalizeResponse(
    response: string,
    senderName: string,
    receiverName: string
  ): string {
    return response
      .replaceAll(SENDER_USERNAME_PLACEHOLDER, senderName)
      .replaceAll(RECEIVER_USERNAME_PLACEHOLDER, receiverName);
  }
}
export default new ConversationAggregationService();
