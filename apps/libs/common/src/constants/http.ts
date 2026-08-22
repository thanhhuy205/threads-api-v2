import { StatusCodes } from "http-status-codes";

export type HttpsCode = (typeof StatusCodes)[keyof typeof StatusCodes];