import { RequestHandler, Request, Response, NextFunction } from "express";
import {
  extractContentFromLines,
  extractLinesFromCsV,
  validateCsvFileContent,
} from "../helpers/helpers";
import { FileData } from "../interfaces/File.interface";

export default function validationMiddleware(): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const fileData = req.body.fileData as FileData;
      const fileExtension = fileData.extension;
      if (fileExtension !== "csv") {
        res.status(400).send("Must be a Csv file");
        return;
      }
      const records = extractLinesFromCsV(fileData.content.toString());
      const numberOfRecords = records.length;

      if (numberOfRecords > 1000) {
        res.status(400).send("Csv file must have at most 1000 records");
        return;
      }

      const csvContent = extractContentFromLines(records);
      const errorMessage = validateCsvFileContent(csvContent);
      if (errorMessage) {
        res.status(400).send(errorMessage);
        return;
      }

      next();
    } catch (err) {
      // log to Sentry
      res.status(400).send("Something is wrong with the file provided");
    }
  };
}
