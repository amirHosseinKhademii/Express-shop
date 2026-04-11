import { User } from "../models/index.js";
let cachedUser = null;
export const attachUser = async (req, _res, next) => {
    try {
        if (!cachedUser) {
            const user = await User.findOne({
                attributes: ["id", "email", "name"],
            });
            if (user) {
                cachedUser = user;
            }
        }
        if (cachedUser) {
            req.user = cachedUser;
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=attach-user.js.map