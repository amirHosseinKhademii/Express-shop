import { User } from "./user.model.js";
import { Product } from "./product.model.js";
User.hasMany(Product, {
    foreignKey: "userId",
    as: "products",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Product.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
export { User, Product };
//# sourceMappingURL=index.js.map