/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import { handleCastError } from "../helpers/handleCastError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";
import AppError from "../error/AppError";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.node_env === "development") {
        console.log(err);
    }

   
    let errorSources: TErrorSources[] = [];
    let statusCode = 500;
    let message = "Something Went Wrong!!";

    /**
     * MONGODB DUPLICATE KEY ERROR
     * Triggered when inserting a record with a unique field (e.g., duplicate email)
     * Error code: 11000
     */
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }

    /**
     * MONGODB CAST ERROR
     * Happens when an invalid ObjectId is passed (wrong format)
     * Example: /users/123 → invalid ObjectId
     */
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }

    /**
     * ZOD VALIDATION ERROR
     * Occurs when an incoming request body fails Zod schema validation
     */
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[];
    }

    /**
     * MONGOOSE VALIDATION ERROR
     * Happens when Mongoose schema validation fails (required fields, regex, min/max)
     */
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[];
        message = simplifiedError.message;
    }

    /**
     * CUSTOM APPLICATION ERROR
     * Manually thrown using AppError class
     * Example: throw new AppError(404, "User not found")
     */
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    /**
     * GENERIC JAVASCRIPT ERROR
     * Any other unhandled error (syntax error, runtime error, etc.)
     */
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    // Send formatted error response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.node_env === "development" ? err : null,
        stack: envVars.node_env === "development" ? err.stack : null
    });
};

export default globalErrorHandler;
