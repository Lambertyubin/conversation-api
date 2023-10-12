import { SQSClient, Message } from "@aws-sdk/client-sqs";
import { Consumer } from "sqs-consumer";
import logger from "../utils/logger";
import credentials from "../awsCredentials";
import conversationAggregationService, {
  ConversationAggregationService,
} from "../services/ConversationAggregation.service";

export class MessageQueueConsumer {
  private _queueUrl: string;
  private _sqsClient: SQSClient;

  constructor(
    queueUrl: string,
    private readonly _conversationAggregationService: ConversationAggregationService = conversationAggregationService
  ) {
    this._queueUrl = queueUrl;
    this._sqsClient = new SQSClient(credentials);
  }

  public async subscribe(): Promise<void> {
    logger.info(`Subscribing to the queue with url: ${this._queueUrl} `);
    const consumer = Consumer.create({
      sqs: this._sqsClient,
      queueUrl: this._queueUrl,
      handleMessage: async (message: Message): Promise<Message | void> => {
        if (message.Body) {
          logger.info(`received message with key: ${message.Body} from queue`);
          await this._conversationAggregationService.aggregate(message.Body);
          logger.info(
            "-> successfully extracted and saved conversations, and messages with responses!"
          );
        }
      },
    });

    consumer.on("error", (err) => {
      logger.error(err);
    });
    consumer.on("processing_error", (err) => {
      logger.error(err);
    });
    consumer.on("timeout_error", (err) => {
      logger.error(err);
    });

    consumer.start();
  }
}
