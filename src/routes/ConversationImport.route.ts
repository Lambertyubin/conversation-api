import { Router } from "express";
import multer from "multer";
import { Route } from "../interfaces/Route.interface";
import { requireAuthentication } from "../middlewares/Auth.middleware";
import {
  fileValidationMiddleware,
  validationMiddleware,
} from "../middlewares/Validation.middleware";
import conversationImportController from "../controllers/ConversationImport.controller";
import { fileMetadataExtractionMiddleware } from "../middlewares/FileMetadataExtraction.middelware";
import { PredefinedResponsesDto } from "../controllers/dtos/PredefinedResponses.dto";

const upload = multer();

class ConversationImportRoute implements Route {
  path = "/conversation-import";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/csv`,
      requireAuthentication,
      upload.single("file"),
      fileMetadataExtractionMiddleware(),
      fileValidationMiddleware(),
      conversationImportController.uploadCsv
    );

    this.router.post(
      `${this.path}/predefined-responses`,
      requireAuthentication,
      validationMiddleware(PredefinedResponsesDto),
      conversationImportController.loadPredefinedResponses
    );
  }
}

export default new ConversationImportRoute();
