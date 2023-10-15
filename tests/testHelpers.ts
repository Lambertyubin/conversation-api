import { Channel, Conversation, Message } from "@prisma/client";
import { FileData } from "src/interfaces/File.interface";
import * as fs from "fs";

export const existingConversation: Conversation = {
  id: "c1",
  senderUsername: "sender",
  receiverUsername: "receiver",
};

export const createdConversation: Conversation = {
  id: "c2",
  senderUsername: "sender",
  receiverUsername: "receiver",
};

export const testConversations = [existingConversation, createdConversation];

export const testMessages: Message[] = [
  {
    id: "m1",
    channel: Channel.EMAIL,
    conversationId: existingConversation.id,
    message: "message",
    response: "response",
  },
  {
    id: "m2",
    channel: Channel.INSTAGRAM,
    conversationId: existingConversation.id,
    message: "message",
    response: "response",
  },
];

export const S3FileKey = "fileKey";

export const fileToUpload: FileData = {
  name: "file_name",
  extension: "csv",
  type: "text/csv",
  size: 50,
  content: Buffer.from("content"),
};

export const testFileContent = fs
  .readFileSync("tests/unit/mockData/conversations.csv")
  .toString();
