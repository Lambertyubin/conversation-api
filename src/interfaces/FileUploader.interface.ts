import { FileData } from "./File.interface";
import { UploadedFile } from "./UploadedFile.interface";

export interface FileUploader {
  upload: (file: FileData) => Promise<UploadedFile | undefined>;
}
