import { Op } from "sequelize";
import { sequelize } from "../utils/sequelize.js";
import { Order, Product, CartItem } from "../models/index.js";
import { NotFoundError } from "../utils/errors.js";
import { ValidationError } from "../utils/errors.js";
import { getOrCreateCart, loadCartWithItems } from "./cart.service.js";
const ORDER_INCLUDE = [
    {
        model: Product,
        as: "products",
        attributes: ["id", "title", "price"],
        through: { attributes: ["quantity"] },
    },
];
export async function createOrder(user, items) {
    if (items.length === 0) {
        throw new ValidationError("Order must contain at least one item");
    }
    const productIds = items.map((i) => i.productId);
    const userProducts = await user.getProducts({ attributes: ["id"] });
    const ownedIds = new Set(userProducts.map((p) => p.id));
    const invalid = productIds.filter((id) => !ownedIds.has(id));
    if (invalid.length > 0) {
        throw new NotFoundError(`Products not found or not owned: ${invalid.join(", ")}`);
    }
    const quantityMap = new Map(items.map((i) => [i.productId, i.quantity]));
    const products = await Product.findAll({
        where: { id: { [Op.in]: [...quantityMap.keys()] } },
    });
    const order = await sequelize.transaction(async (t) => {
        const created = await user.createOrder({}, { transaction: t });
        await addProductsToOrder(created, products, quantityMap, t);
        return created;
    });
    return Order.findByPk(order.id, { include: ORDER_INCLUDE });
}
export async function createOrderFromCart(user) {
    const cart = await getOrCreateCart(user);
    const cartWithItems = await loadCartWithItems(cart);
    if (!cartWithItems)
        throw new NotFoundError("Cart");
    const cartProducts = (await cartWithItems.getItems()) || [];
    if (cartProducts.length === 0) {
        throw new ValidationError("Cart is empty");
    }
    const quantityMap = new Map(cartProducts.map((p) => [p.id, p.cartItem.quantity]));
    const products = await Product.findAll({
        where: { id: { [Op.in]: [...quantityMap.keys()] } },
    });
    const order = await sequelize.transaction(async (t) => {
        const created = await user.createOrder({}, { transaction: t });
        await addProductsToOrder(created, products, quantityMap, t);
        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction: t,
        });
        return created;
    });
    return Order.findByPk(order.id, { include: ORDER_INCLUDE });
}
async function addProductsToOrder(order, products, quantityMap, transaction) {
    const withJunction = products.map((p) => {
        p.orderItem = { quantity: quantityMap.get(p.id) };
        return p;
    });
    await order.addProducts(withJunction, { transaction });
}
export async function getUserOrders(user, options) {
    const [rows, count] = await Promise.all([
        user.getOrders({
            include: ORDER_INCLUDE,
            order: [["createdAt", "DESC"]],
            limit: options.limit,
            offset: options.offset,
        }),
        user.countOrders(),
    ]);
    return { rows, count };
}
export async function getOrderById(userId, orderId) {
    const order = await Order.findOne({
        where: { id: orderId, userId },
        include: ORDER_INCLUDE,
    });
    if (!order)
        throw new NotFoundError("Order");
    return order;
}
//# sourceMappingURL=order.service.js.map