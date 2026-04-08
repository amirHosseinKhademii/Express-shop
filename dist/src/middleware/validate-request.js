import { z } from "zod";
import { ValidationError } from "../utils/errors.js";
export const validateRequest = (schema) => {
    return async (req, _res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                next(new ValidationError("Validation failed", error.errors));
                return;
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validate-request.js.map