import AWSFileUploadClient from "../clients/AWSFileUpload.client";
import { FileUploader } from "../interfaces/FileUploader.interface";
import { UploadedFile } from "../interfaces/UploadedFile.interface";
import { FileData } from "../interfaces/File.interface";
import { PredefinedResponseDto } from "../controllers/dtos/PredefinedResponses.dto";
import predefinedResponsesDao, {
  PredefinedResponsesDao,
} from "../daos/PredefinedResponses.dao";

export class ConversationImportService {
  constructor(
    private readonly _fileUploader: FileUploader = AWSFileUploadClient,
    private readonly _predefinedResponsesDao: PredefinedResponsesDao = predefinedResponsesDao
  ) {}

  public async uploadFile(file: FileData): Promise<UploadedFile | undefined> {
    return await this._fileUploader.upload(file);
  }
  public async loadResponses(data: PredefinedResponseDto[]): Promise<void> {
    await this._predefinedResponsesDao.load(data);
  }
}

export default new ConversationImportService();
