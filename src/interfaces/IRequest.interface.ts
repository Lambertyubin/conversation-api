import { Request } from "express";
import { FileData } from "./File.interface";
import { Pagination } from "./Pagination.interface";
export interface IRequest<ReqBody> extends Request {
  fileData?: FileData;
  body: ReqBody;
  query: any;
  pagination?: Pagination;
}
