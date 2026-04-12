import { Product, Cart, CartItem } from "../models/index.js";
import { NotFoundError } from "../utils/errors.js";
const CART_INCLUDE = [
    {
        model: Product,
        as: "items",
        attributes: ["id", "title", "price"],
        through: { attributes: ["quantity"] },
    },
];
export async function getOrCreateCart(user) {
    const cart = await user.getCart();
    if (cart)
        return cart;
    return user.createCart();
}
export async function loadCartWithItems(cart) {
    return Cart.findByPk(cart.get("id"), { include: CART_INCLUDE });
}
export async function addItemToCart(cart, productId, quantity) {
    const product = await Product.findByPk(productId);
    if (!product)
        throw new NotFoundError("Product");
    const cartId = cart.get("id");
    const [item, created] = await CartItem.findOrCreate({
        where: { cartId, productId },
        defaults: { quantity },
    });
    if (!created) {
        await item.update({ quantity: item.get("quantity") + quantity });
    }
    return loadCartWithItems(cart);
}
export async function removeItemFromCart(cart, productId, quantity) {
    const cartId = cart.get("id");
    const item = await CartItem.findOne({ where: { cartId, productId } });
    if (!item)
        throw new NotFoundError("Cart item");
    const currentQty = item.get("quantity");
    const newQty = currentQty - quantity;
    if (newQty <= 0) {
        await item.destroy();
    }
    else {
        await item.update({ quantity: newQty });
    }
    return loadCartWithItems(cart);
}
//# sourceMappingURL=cart.service.js.map