import { RequestHandler, Request, Response, NextFunction } from "express";

export default function validationMiddleware(): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    next();
  };
}
