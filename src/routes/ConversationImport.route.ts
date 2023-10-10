import { Router } from "express";
import multer from "multer";
import { Route } from "../interfaces/Route.interface";
import { requireAuthentication } from "../middlewares/Auth.middleware";
import validationMiddleware from "../middlewares/Validation.middleware";
import conversationImportController from "../controllers/ConversationImport.controller";
import { fileMetadataExtractionMiddleware } from "../middlewares/FileMetaDataExtraction.middelware";

const upload = multer();

class ConversationImportRoute implements Route {
  path = "/conversation";
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/import`,
      requireAuthentication,
      upload.single("file"),
      validationMiddleware(),
      fileMetadataExtractionMiddleware(),
      conversationImportController.uploadCsv
    );
  }
}

export default new ConversationImportRoute();
