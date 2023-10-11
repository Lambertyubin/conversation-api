import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { FileData } from "../interfaces/File.interface";
import { UploadedFile } from "../interfaces/UploadedFile.interface";
import credentials from "../awsCredentials";

export class AWSClient {
  private _s3Client: S3Client;
  private _sqsClient: SQSClient;
  private readonly _bucketName = process.env.AWS_BUCKET_NAME!;

  constructor() {
    this._s3Client = new S3Client(credentials);
    this._sqsClient = new SQSClient(credentials);
  }

  public async uploadFileToS3(
    file: FileData
  ): Promise<UploadedFile | undefined> {
    const timestamp = Date.now();
    const fileKey = this.generateFileKey(file, timestamp);
    const params = {
      Bucket: this._bucketName,
      Key: fileKey,
      ContentType: file.type,
      Body: file.content,
    };
    const command = new PutObjectCommand(params);

    await this._s3Client.send(command);

    return { fileKey };
  }

  public async downloadFileFromS3(
    fileKey: string
  ): Promise<string | undefined> {
    const command = new GetObjectCommand({
      Bucket: this._bucketName,
      Key: fileKey,
    });

    const response = await this._s3Client.send(command);
    return await response?.Body?.transformToString();
  }

  public async publishQueueMessage(
    messageBody: string | undefined
  ): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: process.env.AWS_QUEUE_URL,
      DelaySeconds: 10,
      MessageBody: messageBody,
    });

    await this._sqsClient.send(command);
  }

  private generateFileKey(file: FileData, timestamp: number): string {
    return `${file.name}-${timestamp}.${file.extension}`;
  }
}

export default new AWSClient();
