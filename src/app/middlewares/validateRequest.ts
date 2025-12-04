import { ZodTypeAny } from "zod";

import { Request, Response, NextFunction } from "express";

const validateRequest = (zodSchema: ZodTypeAny) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (error) {
        next(error)
    }
}

export default validateRequest