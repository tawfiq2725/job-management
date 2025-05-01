import { Response } from "express";
import { HttpStatus } from "./HttpStatus";
export const sendResponse = (
  res: Response,
  status: HttpStatus,
  success: boolean,
  message: string,
  data?: any
) => {
  res.status(status).json({
    success,
    message,
    data,
  });
};