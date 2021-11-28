import {NextFunction, Request, Response} from "express";
import {ApiError} from "../common/utils/apiError";
import {ValidateError} from "tsoa";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        
        return res.status(err.status).json({
            name: err.name,
            status: err.status,
            code: err.code,
            message: err.message
        });
    }

    if (err instanceof ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: err && err.message || "Internal Server Error",
        });
    }

    next();
}
