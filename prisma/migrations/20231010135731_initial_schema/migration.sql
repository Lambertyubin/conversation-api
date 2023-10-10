-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'WHATSAPP', 'EMAIL');

-- CreateTable
CREATE TABLE "PredefinedResponse" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "response" TEXT NOT NULL,

    CONSTRAINT "PredefinedResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "senderUsername" TEXT NOT NULL,
    "receiverUsername" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "conversationId" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
