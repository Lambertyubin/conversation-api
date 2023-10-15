import { describe, expect, it, vi } from "vitest";
import awsClient from "../../src/clients/AWS.client";
import conversationImportService from "../../src/services/ConversationImport.service";
import { S3FileKey, fileToUpload } from "tests/testHelpers";

describe("ConversationImportService", () => {
  describe("uploadFile", () => {
    it("uploads file to S3 bucket and returns its key", async () => {
      const uploadFileToS3Mock = vi
        .spyOn(awsClient, "uploadFileToS3")
        .mockResolvedValue({ fileKey: S3FileKey });
      const publishQueueMessageMock = vi
        .spyOn(awsClient, "publishQueueMessage")
        .mockResolvedValue(undefined);

      const uploadedFileInfo = await conversationImportService.uploadFile(
        fileToUpload
      );

      expect(uploadedFileInfo?.fileKey).toBe(S3FileKey);
      expect(uploadFileToS3Mock.mock.calls.length).toBe(1);
      expect(publishQueueMessageMock.mock.calls.length).toBe(1);
      expect(publishQueueMessageMock).toHaveBeenCalledWith(S3FileKey);
    });

    it("should not publish any message to the queue if file upload is not successful", async () => {
      const uploadFileToS3Mock = vi
        .spyOn(awsClient, "uploadFileToS3")
        .mockResolvedValue(undefined);
      const publishQueueMessageMock = vi
        .spyOn(awsClient, "publishQueueMessage")
        .mockResolvedValue(undefined);

      const uploadedFileInfo = await conversationImportService.uploadFile(
        fileToUpload
      );

      expect(uploadedFileInfo?.fileKey).toBeUndefined();
      expect(uploadFileToS3Mock.mock.calls.length).toBe(1);
      expect(publishQueueMessageMock.mock.calls.length).toBe(0);
    });
  });
});
