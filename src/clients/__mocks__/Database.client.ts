import { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(DatabaseClient.getInstance());
});

class DatabaseClient {
  private static instance = mockDeep<PrismaClient>();
  private constructor() {}
  public static getInstance(): DeepMockProxy<PrismaClient> {
    return this.instance;
  }
}

export default DatabaseClient;
