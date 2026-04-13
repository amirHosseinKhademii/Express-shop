import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";
import { UnauthorizedError } from "../utils/errors.js";
import { parsePagination } from "../utils/pagination.js";
import {
  getUserProductsMdb,
  getUserProductByIdMdb,
} from "../services/product.service.js";
import {
  getCartMdb,
  addItemToCartMdb,
  removeItemFromCartMdb,
} from "../services/cart.service.js";
import {
  createOrderFromCartMdb as createOrderFromCart,
  getUserOrdersMdb as getUserOrders,
  getOrderByIdMdb as getOrderById,
} from "../services/order.service.js";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const { page, limit, offset } = parsePagination(req);
    const { rows, count } = await getUserProductsMdb(req.user, {
      limit,
      offset,
    });

    ApiResponse.paginated(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const product = await getUserProductByIdMdb(
      req.user,
      req.params["id"] as string,
    );

    ApiResponse.success(res, product);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const cart = await getCartMdb(req.user);

    ApiResponse.success(res, cart);
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const productId = req.body["productId"] as string;

    const updated = await addItemToCartMdb(req.user, productId);

    ApiResponse.success(res, updated, "Product added to cart");
  } catch (error) {
    next(error);
  }
};

export const removeProductFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const productId = req.body["productId"] as string;
    const quantity = Math.max(parseInt(req.body["quantity"]) || 1, 1);

    const updated = await removeItemFromCartMdb(req.user, productId, quantity);

    ApiResponse.success(res, updated, "Product removed from cart");
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const order = await createOrderFromCart(req.user);

    ApiResponse.created(res, order, "Order placed");
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const { page, limit, offset } = parsePagination(req);
    const { rows, count } = await getUserOrders(req.user, { limit, offset });

    ApiResponse.paginated(res, rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const order = await getOrderById(req.user.id, req.params["id"] as string);

    ApiResponse.success(res, order);
  } catch (error) {
    next(error);
  }
};
