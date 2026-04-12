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
    return Cart.findByPk(cart.id, { include: CART_INCLUDE });
}
export async function addItemToCart(user, cart, productId, quantity) {
    const owns = await user.hasProduct(productId);
    if (!owns)
        throw new NotFoundError("Product");
    const [item, created] = await CartItem.findOrCreate({
        where: { cartId: cart.id, productId },
        defaults: { quantity },
    });
    if (!created) {
        const cartItem = item;
        await cartItem.update({ quantity: cartItem.quantity + quantity });
    }
    return loadCartWithItems(cart);
}
export async function removeItemFromCart(cart, productId, quantity) {
    const item = await CartItem.findOne({
        where: { cartId: cart.id, productId },
    });
    if (!item)
        throw new NotFoundError("Cart item");
    const cartItem = item;
    const newQty = cartItem.quantity - quantity;
    if (newQty <= 0) {
        await cartItem.destroy();
    }
    else {
        await cartItem.update({ quantity: newQty });
    }
    return loadCartWithItems(cart);
}
//# sourceMappingURL=cart.service.js.map