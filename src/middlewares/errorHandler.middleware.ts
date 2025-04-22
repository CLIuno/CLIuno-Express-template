import { Request, Response } from "express";

import { CustomError } from "./customError.middleware";
import logThisError from "@/helpers/error-logger";

export const handleError = (err: CustomError, req: Request, res: Response) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    logThisError(message);
    res.status(statusCode).send({ error: message });
};
