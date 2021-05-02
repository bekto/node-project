import { Request, Response, NextFunction } from "express";
import { body, validationResult } from 'express-validator';
import logging from "../config/logging";

const NAMESPACE = "Validator";

const userValidationRules = () => {
    return [
        // email must be valid
        body('email').isEmail(),
        // password must be at least 6 char long
        body('password').isLength({ min: 6 }),
    ]
}

const passwordUpdateValidationRules = () => {
    return [
        // old_pass must be entered
        body('old_pass').exists(),
        // new_pass must be at least 6 char long
        body('new_pass').isLength({ min: 6 }),
    ]
}

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    logging.info(NAMESPACE, 'Failed to validate User registration input!')
    return res.status(422).json({
        errors: errors,
    })
}


export default { userValidationRules, passwordUpdateValidationRules, validate };