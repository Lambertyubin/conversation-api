import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest.interface";
import conversationImportService, {
  ConversationImportService,
} from "../services/ConversationImport.service";
import { PredefinedResponsesDto } from "./dtos/PredefinedResponses.dto";
import responseInferenceService, {
  ResponseInferenceService,
} from "../services/ResponseInference.service";
import logger from "../utils/logger";

export class ConversationImportController {
  constructor(
    private readonly _conversationImportService: ConversationImportService = conversationImportService,
    private readonly _responseInferenceService: ResponseInferenceService = responseInferenceService
  ) {}

  public uploadCsv = async (
    req: IRequest<any>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { fileData } = req.body;
    logger.info(`uploading csv file with name: ${fileData.name}`);
    try {
      await this._conversationImportService.uploadFile(fileData!);
      res.status(200).send({ text: "CSV file uploaded successfully" });
    } catch (err: any) {
      logger.error(err);
      res.status(500).send(`Something went wrong ${err.message}`);
      next(err);
    }
  };

  public loadPredefinedResponses = async (
    req: IRequest<PredefinedResponsesDto>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { data } = req.body;
    try {
      await this._responseInferenceService.loadResponses(data);
      res.status(200).send();
    } catch (err: any) {
      logger.error(err);
      res.status(500).send(`Something went wrong ${err.message}`);
      next(err);
    }
  };
}

export default new ConversationImportController();
