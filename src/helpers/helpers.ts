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

export const validateConversationChannels = (
  csvContent: string[][]
): boolean => {
  let hasValidConversationChannels = true;
  csvContent.forEach((line) => {
    const channel = line[3];
    const isAcceptedChannel = Object.values(ConversationChannel).includes(
      channel.toLowerCase() as ConversationChannel
    );
    if (!isAcceptedChannel) {
      hasValidConversationChannels = false;
      return;
    }
  });
  return hasValidConversationChannels;
};
