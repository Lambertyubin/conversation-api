import { Request, Response, NextFunction, RequestHandler } from "express";

export const fileMetadataExtractionMiddleware = (): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;
    const fileData = {
      name: file?.originalname,
      type: file?.mimetype,
      content: file?.buffer,
      size: file?.size,
      extension: `${file?.originalname.split(".").pop()}`,
    };

    Object.assign(req.body, { fileData });
    return next();
  };
};
