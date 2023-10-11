import { Channel, PredefinedResponse, PrismaClient } from "@prisma/client";
import { PredefinedResponseDto } from "../controllers/dtos/PredefinedResponses.dto";
import { getChannel } from "../helpers/helpers";
import DatabaseClient from "../clients/Database.client";

export class PredefinedResponsesDao {
  constructor(
    private readonly _dbClient: PrismaClient = DatabaseClient.getInstance()
  ) {}

  public async load(data: PredefinedResponseDto[]) {
    await this._dbClient.predefinedResponse.createMany({
      data: [...data.map((d) => ({ ...d, channel: getChannel(d.channel) }))],
    });
  }

  public async findAllByChannel(
    channel: Channel
  ): Promise<PredefinedResponse[]> {
    return await this._dbClient.predefinedResponse.findMany({
      where: { channel },
    });
  }
}

export default new PredefinedResponsesDao();
