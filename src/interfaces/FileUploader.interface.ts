import { FileData } from "./File.interface";
import { UploadedFile } from "./UploadedFile.interface";

export interface FileUploader {
  uploadFileToS3: (file: FileData) => Promise<UploadedFile | undefined>;
  publishQueueMessage: (key: string) => Promise<void>;
}
