import awsClient, { AWSClient } from "../clients/AWS.client";
import { UploadedFile } from "../interfaces/UploadedFile.interface";
import { FileData } from "../interfaces/File.interface";
import logger from "../utils/logger";

export class ConversationImportService {
  constructor(private readonly _awsClient: AWSClient = awsClient) {}

  public async uploadFile(file: FileData): Promise<UploadedFile | undefined> {
    logger.info(`uploading file to S3 bucket.`);
    const uploadedFileInfo = await this._awsClient.uploadFileToS3(file);
    if (uploadedFileInfo) {
      const fileKey = uploadedFileInfo?.fileKey;
      logger.info(`publishing message with key ${fileKey} to queue.`);
      await this._awsClient.publishQueueMessage(fileKey);
    }
    return uploadedFileInfo;
  }
}

export default new ConversationImportService();
