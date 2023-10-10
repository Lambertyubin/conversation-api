import { PrismaClient, Channel } from "@prisma/client";
import { PredefinedResponseDto } from "../controllers/dtos/PredefinedResponses.dto";
import { getChannel } from "../helpers/helpers";

export class PredefinedResponsesDao {
  constructor(private readonly _dbClient: PrismaClient) {}

  public async load(data: PredefinedResponseDto[]) {
    await this._dbClient.predefinedResponse.createMany({
      data: [...data.map((d) => ({ ...d, channel: getChannel(d.channel) }))],
    });
  }
}

export default new PredefinedResponsesDao(new PrismaClient());
