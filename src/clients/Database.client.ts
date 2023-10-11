import { PrismaClient } from "@prisma/client";

export default class DatabaseClient {
  private static instance: PrismaClient = new PrismaClient();
  private constructor() {}
  public static getInstance(): PrismaClient {
    return this.instance;
  }
}
