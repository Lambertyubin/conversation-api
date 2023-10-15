import { beforeEach, describe, expect, it, vi } from "vitest";
import awsClient from "../../src/clients/AWS.client";
import {
  existingConversation,
  testFileContent,
  testMessages,
} from "tests/testHelpers";
import responseInferenceService from "../../src/services/ResponseInference.service";
import { ConversationChannel } from "../../src/interfaces/enums/ConversationChannel.enum";
import conversationService from "../../src/services/Conversation.service";
import messageService from "../../src/services/Message.service";
import conversationAggregationService from "../../src/services/ConversationAggregation.service";

describe("ConversationAggregationService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("downloads, aggregates and saves only conversations with responses", async () => {
    const downloadFileFromS3Mock = vi
      .spyOn(awsClient, "downloadFileFromS3")
      .mockResolvedValue(testFileContent);
    let response = "inferred-";

    const inferResponseMock = vi
      .spyOn(responseInferenceService, "inferResponse")
      .mockImplementation((message, channel) => {
        response = response + message;
        return Promise.resolve(
          channel === ConversationChannel.INSTAGRAM ? response : undefined
        );
      });

    const getConversationIdMock = vi
      .spyOn(conversationService, "getConversationId")
      .mockResolvedValue(existingConversation.id);

    const createMessageMock = vi
      .spyOn(messageService, "createMessage")
      .mockResolvedValue({
        ...testMessages[0],
        response,
      });

    await conversationAggregationService.aggregate("sourceFileKey");

    expect(downloadFileFromS3Mock.mock.calls.length).toBe(1);
    expect(inferResponseMock.mock.calls.length).toBe(2);
    expect(getConversationIdMock.mock.calls.length).toBe(1);
    expect(createMessageMock.mock.calls.length).toBe(1);
  });
  it("should only save conversations that have inferred responses", async () => {
    const downloadFileFromS3Mock = vi
      .spyOn(awsClient, "downloadFileFromS3")
      .mockResolvedValue(testFileContent);
    let response = "inferred-";

    const inferResponseMock = vi
      .spyOn(responseInferenceService, "inferResponse")
      .mockReturnValue(Promise.resolve(undefined));

    const getConversationIdMock = vi
      .spyOn(conversationService, "getConversationId")
      .mockResolvedValue(existingConversation.id);

    const createMessageMock = vi
      .spyOn(messageService, "createMessage")
      .mockResolvedValue({
        ...testMessages[0],
        response,
      });

    await conversationAggregationService.aggregate("sourceFileKey");

    expect(downloadFileFromS3Mock.mock.calls.length).toBe(1);
    expect(inferResponseMock.mock.calls.length).toBe(2);
    expect(getConversationIdMock.mock.calls.length).toBe(0); // no conversation is saved
    expect(createMessageMock.mock.calls.length).toBe(0); // no message is saved
  });
});
