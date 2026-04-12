import { DataTypes } from "sequelize";
import { sequelize } from "../utils/sequelize.js";
export const Order = sequelize.define("order", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
            model: "users",
            key: "id",
        },
    },
});
//# sourceMappingURL=order.model.js.map