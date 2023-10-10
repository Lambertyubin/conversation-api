import AWSFileUploadClient from "../clients/AWSFileUpload.client";
import { FileUploader } from "../interfaces/FileUploader.interface";
import { UploadedFile } from "../interfaces/UploadedFile.interface";
import { FileData } from "../interfaces/File.interface";

export class ConversationImportService {
  constructor(
    private readonly _fileUploader: FileUploader = AWSFileUploadClient
  ) {}

  public async uploadFile(file: FileData): Promise<UploadedFile | undefined> {
    const result = await this._fileUploader.upload(file);
    console.log("RESULT: ", result);
    return result;
  }
}

export default new ConversationImportService();
