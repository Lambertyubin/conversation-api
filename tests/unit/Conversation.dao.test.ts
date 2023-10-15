import { describe, expect, it, vi } from "vitest";
import dbClient from "../../src/clients/__mocks__/Database.client";
import { existingConversation } from "tests/testHelpers";
import conversationDao from "../../src/daos/Conversation.dao";

vi.mock("../../src/clients/Database.client");

describe("ConversationDao", () => {
  describe("findConversation", () => {
    it("returns an existing conversation from the db", async () => {
      const existingConversationMock = dbClient
        .getInstance()
        .conversation.findFirst.mockResolvedValue(existingConversation);

      const conversation = await conversationDao.findConversation(
        "sender",
        "receiver"
      );

      expect(conversation).toStrictEqual(existingConversation);
      expect(existingConversationMock.mock.calls.length).toBe(1);
    });
  });
});
