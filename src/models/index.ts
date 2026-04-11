import { User } from "./user.model.js";
import { Product } from "./product.model.js";
import { Cart } from "./cart.model.js";
import { CartItem } from "./cartItem.model.js";

// ─── One-to-Many: User → Products ───────────────────────────────
// A user can create many products; each product belongs to exactly one user.
// Deleting a user cascades to remove all their products.
// Adds: user.getProducts(), user.createProduct(), product.getUser()
User.hasMany(Product, {
  foreignKey: { name: "userId", allowNull: false },
  as: "products",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
  as: "creator",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ─── One-to-One: User → Cart ────────────────────────────────────
// Each user has exactly one cart (created on first use).
// Deleting a user cascades to remove their cart.
// Adds: user.getCart(), user.createCart(), cart.getUser()
User.hasOne(Cart, {
  foreignKey: { name: "userId", allowNull: false },
  as: "cart",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Cart.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: false },
  as: "owner",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// ─── Many-to-Many: Cart ↔ Products (through CartItem) ───────────
// A cart can contain many products; a product can appear in many carts.
// CartItem is the junction table holding the quantity per product per cart.
// Adds: cart.getProducts(), cart.addProduct(), product.getCarts()
Cart.belongsToMany(Product, {
  through: CartItem,
  foreignKey: "cartId",
  otherKey: "productId",
  as: "items",
  onDelete: "CASCADE",
});

Product.belongsToMany(Cart, {
  through: CartItem,
  foreignKey: "productId",
  otherKey: "cartId",
  as: "carts",
  onDelete: "CASCADE",
});

export { User, Product, Cart, CartItem };
