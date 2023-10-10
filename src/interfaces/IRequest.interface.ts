import { Request } from "express";
import { FileData } from "./File.interface";
export interface IRequest<ReqBody> extends Request {
  fileData?: FileData;
  body: ReqBody;
}
