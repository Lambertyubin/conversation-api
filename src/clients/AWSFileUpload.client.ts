import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { FileData } from "../interfaces/File.interface";
import { FileUploader } from "../interfaces/FileUploader.interface";
import { UploadedFile } from "../interfaces/UploadedFile.interface";

export class AWSFileUploadClient implements FileUploader {
  private _client: S3Client;
  private readonly _bucketName = process.env.AWS_BUCKET_NAME!;

  constructor() {
    this._client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
      },
      region: process.env.AWS_BUCKET_REGION!,
    });
  }

  public async upload(file: FileData): Promise<UploadedFile | undefined> {
    try {
      const path = await this.uploadFile(file);
      return { path };
    } catch (err) {
      throw err;
    }
  }

  private async uploadFile(file: FileData): Promise<string> {
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);
    const params = {
      Bucket: this._bucketName,
      Key: fileKey,
      ContentType: file.type,
      Body: file.content,
    };
    const command = new PutObjectCommand(params);

    await this._client.send(command);

    return `${this._bucketName}/${fileKey}`;
  }

  private generateFileKey(file: FileData, timestamp: number): string {
    return `${file.name}-${timestamp}.${file.extension}`;
  }
}

export default new AWSFileUploadClient();
