import type { Request } from "express";
import type { HydratedDocument, Types } from "mongoose";
import {
  OrderModel,
  type IOrder,
  type IOrderItem,
} from "../models/order.model.js";
import { ProductModel } from "../models/product.model.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { toObjectId } from "../utils/parse-id.js";
import { getCartMdb } from "./cart.service.js";

type User = NonNullable<Request["user"]>;
type OrderDoc = HydratedDocument<IOrder>;

// ─── Mongoose order services ─────────────────────────────────

// interface OrderInputMdb {
//   productId: string;
//   quantity: number;
// }

async function resolveProductPrices(
  pids: Types.ObjectId[],
): Promise<Map<string, number>> {
  const docs = await ProductModel.find({ _id: { $in: pids } })
    .select("price")
    .lean();
  return new Map(docs.map((d) => [d._id.toString(), d.price]));
}

async function computeTotal(items: IOrderItem[]): Promise<number> {
  const priceMap = await resolveProductPrices(items.map((i) => i.productId));
  return items.reduce((sum, i) => {
    const price = priceMap.get(i.productId.toString()) ?? 0;
    return sum + price * i.quantity;
  }, 0);
}

// export async function createOrderMdb(
//   user: User,
//   items: OrderInputMdb[],
// ): Promise<OrderDoc> {
//   if (items.length === 0) {
//     throw new ValidationError("Order must contain at least one item");
//   }

//   const pids = items.map((i) => toObjectId(i.productId, "Product"));
//   const quantityMap = new Map(items.map((i) => [i.productId, i.quantity]));

//   const foundProducts = await ProductModel.find({
//     _id: { $in: pids },
//     userId: user._id,
//   })
//     .select("_id")
//     .lean();

//   if (foundProducts.length !== pids.length) {
//     const foundIds = new Set(foundProducts.map((p) => p._id.toString()));
//     const missing = items
//       .filter((i) => !foundIds.has(i.productId))
//       .map((i) => i.productId);
//     throw new NotFoundError(
//       `Products not found or not owned: ${missing.join(", ")}`,
//     );
//   }

//   const orderItems: IOrderItem[] = pids.map((pid) => ({
//     productId: pid,
//     quantity: quantityMap.get(pid.toString())!,
//   }));

//   const total = await computeTotal(orderItems);

//   return OrderModel.create({
//     userId: user._id,
//     items: orderItems,
//     total,
//   });
// }

export async function createOrderFromCartMdb(user: User): Promise<OrderDoc> {
  const cartItems = await getCartMdb(user);

  if (cartItems.length === 0) {
    throw new ValidationError("Cart is empty");
  }

  const orderItems: IOrderItem[] = cartItems.map((item) => ({
    productId: toObjectId(item.productId, "Product"),
    quantity: item.quantity,
  }));

  const total = await computeTotal(orderItems);

  const order = await OrderModel.create({
    userId: user._id,
    items: orderItems,
    total,
  });

  await user.clearCart();
  return order;
}

export async function getUserOrdersMdb(
  user: User,
  options: { limit: number; offset: number },
): Promise<{ rows: IOrder[]; count: number }> {
  const filter = { userId: user._id };

  const [rows, count] = await Promise.all([
    OrderModel.find(filter)
      .populate("items.productId", "title price description")
      .sort({ createdAt: -1 })
      .skip(options.offset)
      .limit(options.limit)
      .lean(),
    OrderModel.countDocuments(filter),
  ]);

  return { rows, count };
}

export async function getOrderByIdMdb(
  userId: string,
  orderId: string,
): Promise<IOrder> {
  const oid = toObjectId(orderId, "Order");
  const uid = toObjectId(userId, "User");
  const order = await OrderModel.findOne({ _id: oid, userId: uid })
    .populate("items.productId", "title price description")
    .populate("userId", "name email")
    .lean();
  if (!order) throw new NotFoundError("Order");
  return order;
}

// ─── Sequelize (commented out) ────────────────────────────────

// interface OrderInput {
//   productId: number;
//   quantity: number;
// }

// const ORDER_INCLUDE = [
//   {
//     model: Product,
//     as: "products",
//     attributes: ["id", "title", "price"],
//     through: { attributes: ["quantity"] },
//   },
// ];

// export async function createOrder(
//   user: User,
//   items: OrderInput[],
// ): Promise<OrderInstance | null> {
//   if (items.length === 0) {
//     throw new ValidationError("Order must contain at least one item");
//   }
//
//   const productIds = items.map((i) => i.productId);
//   const userProducts = await user.getProducts({ attributes: ["id"] });
//
//   const ownedIds = new Set(userProducts.map((p) => p.id));
//   const invalid = productIds.filter((id) => !ownedIds.has(id));
//   if (invalid.length > 0) {
//     throw new NotFoundError(
//       `Products not found or not owned: ${invalid.join(", ")}`,
//     );
//   }
//
//   const quantityMap = new Map(items.map((i) => [i.productId, i.quantity]));
//   const products = (await Product.findAll({
//     where: { id: { [Op.in]: [...quantityMap.keys()] } },
//   })) as unknown as ProductInstance[];
//
//   const order = await sequelize.transaction(async (t) => {
//     const created = await user.createOrder({}, { transaction: t });
//     await addProductsToOrder(created, products, quantityMap, t);
//     return created;
//   });
//
//   return Order.findByPk(order.id, {
//     include: ORDER_INCLUDE,
//   }) as Promise<OrderInstance | null>;
// }

// export async function createOrderFromCart(
//   user: User,
// ): Promise<OrderInstance | null> {
//   const cart = await getOrCreateCart(user);
//   const cartWithItems = await loadCartWithItems(cart);
//   if (!cartWithItems) throw new NotFoundError("Cart");
//
//   const cartProducts = (await cartWithItems.getItems()) || [];
//   if (cartProducts.length === 0) {
//     throw new ValidationError("Cart is empty");
//   }
//
//   const quantityMap = new Map(
//     cartProducts.map((p) => [p.id, p.cartItem!.quantity]),
//   );
//
//   const products = (await Product.findAll({
//     where: { id: { [Op.in]: [...quantityMap.keys()] } },
//   })) as unknown as ProductInstance[];
//
//   const order = await sequelize.transaction(async (t) => {
//     const created = await user.createOrder({}, { transaction: t });
//     await addProductsToOrder(created, products, quantityMap, t);
//
//     await CartItem.destroy({
//       where: { cartId: cart.id },
//       transaction: t,
//     });
//
//     return created;
//   });
//
//   return Order.findByPk(order.id, {
//     include: ORDER_INCLUDE,
//   }) as Promise<OrderInstance | null>;
// }

// async function addProductsToOrder(
//   order: OrderInstance,
//   products: ProductInstance[],
//   quantityMap: Map<number, number>,
//   transaction: Transaction,
// ): Promise<void> {
//   const withJunction = products.map((p) => {
//     p.orderItem = { quantity: quantityMap.get(p.id)! };
//     return p;
//   });
//   await order.addProducts(withJunction, { transaction });
// }

// export async function getUserOrders(
//   user: User,
//   options: { limit: number; offset: number },
// ): Promise<{ rows: OrderInstance[]; count: number }> {
//   const [rows, count] = await Promise.all([
//     user.getOrders({
//       include: ORDER_INCLUDE,
//       order: [["createdAt", "DESC"]],
//       limit: options.limit,
//       offset: options.offset,
//     }),
//     user.countOrders(),
//   ]);
//   return { rows, count };
// }

// export async function getOrderById(
//   userId: number,
//   orderId: number,
// ): Promise<OrderInstance> {
//   const order = await Order.findOne({
//     where: { id: orderId, userId },
//     include: ORDER_INCLUDE,
//   });
//   if (!order) throw new NotFoundError("Order");
//   return order as unknown as OrderInstance;
// }

// ─── MongoDB (native driver) ─────────────────────────────────
