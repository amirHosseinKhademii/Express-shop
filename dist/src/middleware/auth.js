import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { UnauthorizedError } from "../utils/errors.js";
export const authenticate = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }
        const payload = jwt.verify(token, config.jwt.secret);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error);
            return;
        }
        next(new UnauthorizedError("Invalid token"));
    }
};
//# sourceMappingURL=auth.js.map