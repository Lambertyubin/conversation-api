import { ConversationChannel } from "../interfaces/enums/ConversationChannel.enum";
import { PredefinedResponseDto } from "../controllers/dtos/PredefinedResponses.dto";
import predefinedResponsesDao, {
  PredefinedResponsesDao,
} from "../daos/PredefinedResponses.dao";
import { getChannel } from "../helpers/helpers";

export class ResponseInferenceService {
  constructor(
    private readonly _predefinedResponsesDao: PredefinedResponsesDao = predefinedResponsesDao
  ) {}

  public async inferResponse(
    message: string,
    channel: ConversationChannel
  ): Promise<string | undefined> {
    const predefinedResponses =
      await this._predefinedResponsesDao.findAllByChannel(getChannel(channel));

    const inferredRecord = predefinedResponses.find((record) =>
      message.toLowerCase().trim().includes(record.entity.toLowerCase().trim())
    );

    return inferredRecord?.response;
  }

  public async loadResponses(data: PredefinedResponseDto[]): Promise<void> {
    await this._predefinedResponsesDao.load(data);
  }
}

export default new ResponseInferenceService();
