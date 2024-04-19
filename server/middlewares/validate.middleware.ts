import express, { Response, NextFunction } from "express";
import { validationResult } from "express-validator";

function validateForm(req: express.Request, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        throw new Error("provided form data is incorrect");
    }

    next();
}

export default { validateForm };