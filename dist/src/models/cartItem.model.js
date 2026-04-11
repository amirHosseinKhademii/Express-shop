import { sequelize } from "../utils/sequelize.js";
import { DataTypes } from "sequelize";
export const CartItem = sequelize.define("cartItem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "cart_id",
        references: {
            model: "carts",
            key: "id",
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
        references: {
            model: "products",
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1,
        },
    },
});
//# sourceMappingURL=cartItem.model.js.map