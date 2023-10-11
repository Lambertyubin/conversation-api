import { Response, NextFunction, RequestHandler } from "express";
import { IRequest } from "../interfaces/IRequest.interface";

export function paginationMiddleware(): RequestHandler {
  return (req: IRequest<any>, res: Response, next: NextFunction) => {
    if (req.query.page && req.query.pageSize) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.pageSize as string) || 20;
      const skip = (page - 1) * limit;
      req.pagination = { skip, limit };
    }

    next();
  };
}
