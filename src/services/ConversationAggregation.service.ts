import awsClient, { AWSClient } from "../clients/AWS.client";

export class ConversationAggregationService {
  constructor(private readonly _awsClient: AWSClient = awsClient) {}
  public async aggregate(sourceFileKey: string | undefined): Promise<void> {
    if (sourceFileKey) {
      const fileContent = await this._awsClient.downloadFileFromS3(
        sourceFileKey
      );
    }
  }
}
export default new ConversationAggregationService();
