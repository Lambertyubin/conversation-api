import { Request } from "express";
import { FileData } from "./File.interface";
export interface IRequest extends Request {
  fileData?: FileData;
}
