import { Request, Response, NextFunction } from "express";

export const requireAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (process.env.AUTH === "false") {
      return next();
    }
    // handle authentication
    next();
  } catch (err) {
    res.status(401).send();
  }
};
