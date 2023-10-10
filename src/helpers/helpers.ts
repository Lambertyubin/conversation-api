import { Channel } from "@prisma/client";
import { ConversationChannel } from "../interfaces/enums/ConversationChannel.enum";

export const extractLinesFromCsV = (text?: string): string[] => {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .slice(1);
};

export const extractContentFromLines = (lines: string[]): string[][] => {
  return lines.map((line) => line.split(",").map((cell) => cell.trim()));
};

export const validateCsvFileContent = (
  csvContent: string[][]
): string | undefined => {
  let errorMessage;
  if (!csvContent.length || !csvContent[0].length) {
    return "File must not be empty";
  }
  csvContent.forEach((line, lineIndex) => {
    const numberOfEntries = line.length;
    const sender = numberOfEntries > 0 ? line[0] : undefined; // avoiding out-of-range index
    const receiver = numberOfEntries > 1 ? line[1] : undefined;
    const message = numberOfEntries > 2 ? line[2] : undefined;
    const channel = numberOfEntries > 3 ? line[3] : undefined;
    const isAcceptedChannel = Object.values(ConversationChannel).includes(
      channel?.toLowerCase() as ConversationChannel
    );
    const lineNumber = lineIndex + 2; // because we removed the first line as it contains labels
    if (numberOfEntries !== 4) {
      errorMessage = `Line ${lineNumber} does not contain exactly 4 comma separated entries`;
      return;
    }
    if (!sender || !receiver || !message || !channel) {
      errorMessage = `Line ${lineNumber} has an empty entry`;
      return;
    }
    if (sender[0] !== "@" || receiver[0] !== "@") {
      errorMessage = `Line ${lineNumber} has wrong format for sender or receiver username`;
      return;
    }
    if (!isAcceptedChannel) {
      errorMessage = `Conversation channel must be any of facebook, instagram, whatsapp, or email on line ${lineNumber} `;
      return;
    }
  });
  return errorMessage;
};

export const getChannel = (channel: ConversationChannel): Channel => {
  if (channel === ConversationChannel.EMAIL) return Channel.EMAIL;
  if (channel === ConversationChannel.FACEBOOK) return Channel.FACEBOOK;
  if (channel === ConversationChannel.INSTAGRAM) return Channel.INSTAGRAM;
  return Channel.WHATSAPP;
};
