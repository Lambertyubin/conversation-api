import { RequestHandler, Request, Response, NextFunction } from "express";
import {
  extractContent,
  extractRecords,
  validateCsvFileContent,
} from "../helpers/helpers";
import { FileData } from "../interfaces/File.interface";
import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";

export function fileValidationMiddleware(): RequestHandler {
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
      const records = extractRecords(fileData.content.toString());
      const numberOfRecords = records.length;

      if (numberOfRecords > 1000) {
        res.status(400).send("Csv file must have at most 1000 records");
        return;
      }

      const csvContent = extractContent(records);
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

export function validationMiddleware(
  type: any,
  skipMissingProperties = false
): RequestHandler {
  return async (req, res, next): Promise<void> => {
    const data = plainToInstance(type, req.body);
    const errors = await validate(data, {
      skipMissingProperties,
      forbidUnknownValues: false,
    });
    req.body = data;
    if (errors.length > 0) {
      const messages = errors.map((error: ValidationError) => {
        const message = error.toString();
        const lines = message.split("\n");
        lines.shift();
        return lines.join("\n");
      });

      //TODO: log error in Sentry
      res.status(400).send(messages.join("\n"));
      return;
    } else {
      next();
    }
  };
}
