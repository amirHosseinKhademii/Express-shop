import { z } from "zod";
import { ValidationError } from "../utils/errors.js";
function flattenZodErrors(error) {
    const fieldErrors = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
            fieldErrors[path] = issue.message;
        }
    }
    return fieldErrors;
}
export const validateRequest = (schema) => {
    return async (req, _res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.body = parsed.body;
            req.query = parsed.query;
            req.params = parsed.params;
            next();
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const fields = flattenZodErrors(error);
                const messages = Object.entries(fields)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join("; ");
                next(new ValidationError(messages, Object.entries(fields).map(([field, message]) => ({ field, message }))));
                return;
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validate-request.js.map