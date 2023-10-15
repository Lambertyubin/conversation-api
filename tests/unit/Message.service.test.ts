import { expect, describe, vi, it } from "vitest";
import messageDao from "../../src/daos/Message.dao";
import { existingConversation, testMessages } from "tests/testHelpers";
import messageService from "../../src/services/Message.service";
import { ConversationChannel } from "src/interfaces/enums/ConversationChannel.enum";

describe("MessageService", () => {
  describe("getMessagesByConversation", async () => {
    it("returns all existing messages for a conversation", async () => {
      const getMessagesByConversationMock = vi
        .spyOn(messageDao, "getMessagesByConversation")
        .mockResolvedValue(testMessages);

      const messages = await messageService.getMessagesByConversation(
        existingConversation.id
      );

      expect(messages).toStrictEqual(testMessages);
      expect(getMessagesByConversationMock.mock.calls.length).toBe(1);
    });
  });
  describe("createMessage", async () => {
    it("creates and returns a new message", async () => {
      const createMessageMock = vi
        .spyOn(messageDao, "createMessage")
        .mockResolvedValue(testMessages[0]);

      const { message, channel, conversationId, response } = testMessages[0];

      const newMessage = await messageService.createMessage(
        message,
        response,
        channel as ConversationChannel,
        conversationId!
      );

      expect(newMessage).toStrictEqual(testMessages[0]);
      expect(createMessageMock.mock.calls.length).toBe(1);
    });
  });
});
