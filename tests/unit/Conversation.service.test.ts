import { expect, describe, vi, it, beforeEach } from "vitest";
import conversationService from "../../src/services/Conversation.service";
import {
  testConversations,
  createdConversation,
  existingConversation,
} from "tests/testHelpers";
import conversationDao from "../../src/daos/Conversation.dao";

describe("ConversationService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe("getConversationId", () => {
    it("returns the id of a conversation when the conversation already exists", async () => {
      const findConversationMock = vi
        .spyOn(conversationDao, "findConversation")
        .mockResolvedValue(existingConversation);
      const createConversationMock = vi
        .spyOn(conversationDao, "createConversation")
        .mockResolvedValue(createdConversation);

      const conversationId = await conversationService.getConversationId(
        "sender",
        "receiver"
      );

      expect(conversationId).toBe(existingConversation.id);
      expect(findConversationMock.mock.calls.length).toBe(1);
      expect(createConversationMock.mock.calls.length).toBe(0);
    });

    it("creates a new conversation and returns its id if the conversation does not exist", async () => {
      const findConversationMock = vi
        .spyOn(conversationDao, "findConversation")
        .mockResolvedValue(null);
      const createConversationMock = vi
        .spyOn(conversationDao, "createConversation")
        .mockResolvedValue(createdConversation);

      const conversationId = await conversationService.getConversationId(
        "sender",
        "receiver"
      );

      expect(conversationId).toBe(createdConversation.id);
      expect(findConversationMock.mock.calls.length).toBe(1);
      expect(createConversationMock.mock.calls.length).toBe(1);
    });

    it("throws an error if it can neither get an existing conversation nor create a new one", async () => {
      const findConversationMock = vi
        .spyOn(conversationDao, "findConversation")
        .mockResolvedValue(null);
      const createConversationMock = vi
        .spyOn(conversationDao, "createConversation")
        .mockResolvedValue(null);

      try {
        await conversationService.getConversationId("sender", "receiver");
        expect(createConversationMock.mock.calls.length).toBe(1);
        expect(findConversationMock.mock.calls.length).toBe(1);
      } catch (error: any) {
        expect(error.message).toBe("couln't get or create a conversation");
      }
    });
  });

  describe("getAllConversations", async () => {
    it("returns all existing conversations", async () => {
      const getAllConversationsMock = vi
        .spyOn(conversationDao, "getAllConversations")
        .mockResolvedValue(testConversations);

      const conversations = await conversationService.getAllConversations();

      expect(conversations).toStrictEqual(testConversations);
      expect(getAllConversationsMock.mock.calls.length).toBe(1);
    });
  });
});
