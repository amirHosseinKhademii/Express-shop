import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { UnauthorizedError } from "../utils/errors.js";
import { User } from "../models/index.js";
export const authenticate = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }
        const payload = jwt.verify(token, config.jwt.secret);
        const user = await User.findByPk(payload.id, {
            attributes: ["id", "email", "name"],
        });
        if (!user)
            throw new UnauthorizedError("User no longer exists");
        req.user = user;
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