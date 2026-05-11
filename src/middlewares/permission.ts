import { NextFunction, Request, Response } from "express";

export const permission = async (
  req: Request,
  _res: Response,
  next: NextFunction,
  permissions: string[],
) => {};
