import { HttpsCode } from "@/constants/http";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    res.success = (status: HttpsCode, message?: string | undefined, data?: any, passProps = {}) => {
        return res.status(status).json({
            success: true,
            ...(message !== undefined ? { message } : {}),
            ...(data !== undefined && data !== null ? { data } : {}),
            ...passProps
        });
    };

    res.paginate = ({ rows, pagination }: { rows: any; pagination: any }) => {
        return res.success(StatusCodes.OK, undefined, rows, { pagination });
    };

    res.error = (status: HttpsCode, message?: string | undefined, errors?: any, passProps = {}) => {
        return res.status(status).json({
            success: false,
            ...(message !== undefined ? { message } : {}),
            ...(errors !== undefined && errors !== null ? { errors } : {}),
            ...passProps
        });
    };
    next();
};