import awsClient, { AWSClient } from "../clients/AWS.client";
import { UploadedFile } from "../interfaces/UploadedFile.interface";
import { FileData } from "../interfaces/File.interface";

export class ConversationImportService {
  constructor(private readonly _awsClient: AWSClient = awsClient) {}

  public async uploadFile(file: FileData): Promise<UploadedFile | undefined> {
    const uploadedFileInfo = await this._awsClient.uploadFileToS3(file);
    if (uploadedFileInfo) {
      await this._awsClient.publishQueueMessage(uploadedFileInfo?.fileKey);
    }
    return uploadedFileInfo;
  }
}

export default new ConversationImportService();
