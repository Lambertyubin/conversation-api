import { Response, NextFunction, RequestHandler } from "express";
import { IRequest } from "../interfaces/IRequest.interface";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 20;
export function paginationMiddleware(): RequestHandler {
  return (req: IRequest<any>, res: Response, next: NextFunction) => {
    if (req.query.page && req.query.pageSize) {
      const page = parseInt(req.query.page as string) || DEFAULT_PAGE_NUMBER;
      const limit = parseInt(req.query.pageSize as string) || DEFAULT_PAGE_SIZE;
      const skip = (page - 1) * limit;
      req.pagination = { skip, limit };
    }

    next();
  };
}
