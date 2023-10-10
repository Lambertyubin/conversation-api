import { Response, NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest.interface";
import conversationImportService, {
  ConversationImportService,
} from "../services/ConversationImport.service";

export class ConversationImportController {
  constructor(
    private readonly _conversationImportService: ConversationImportService = conversationImportService
  ) {}

  public uploadCsv = async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { fileData } = req.body;
    try {
      console.log("File-data: ", fileData);
      await this._conversationImportService.uploadFile(fileData!);
      res.status(200).send({ text: "CSV file uploaded successfully" });
    } catch (err: any) {
      // log to Sentry
      res.status(500).send(`Something went wrong ${err.message}`);
      next(err);
    }
  };
}

export default new ConversationImportController();
