import awsClient, { AWSClient } from "../clients/AWS.client";
import { FileUploader } from "../interfaces/FileUploader.interface";
import { UploadedFile } from "../interfaces/UploadedFile.interface";
import { FileData } from "../interfaces/File.interface";
import { PredefinedResponseDto } from "../controllers/dtos/PredefinedResponses.dto";
import predefinedResponsesDao, {
  PredefinedResponsesDao,
} from "../daos/PredefinedResponses.dao";

export class ConversationImportService {
  constructor(
    private readonly _awsClient: AWSClient = awsClient,
    private readonly _predefinedResponsesDao: PredefinedResponsesDao = predefinedResponsesDao
  ) {}

  public async uploadFile(file: FileData): Promise<UploadedFile | undefined> {
    const uploadedFileInfo = await this._awsClient.uploadFileToS3(file);
    if (uploadedFileInfo) {
      await this._awsClient.publishQueueMessage(uploadedFileInfo?.fileKey);
    }
    return uploadedFileInfo;
  }
  public async loadResponses(data: PredefinedResponseDto[]): Promise<void> {
    await this._predefinedResponsesDao.load(data);
  }
}

export default new ConversationImportService();
