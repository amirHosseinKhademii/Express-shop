import type { Request, Response, NextFunction } from "express";
import { EmptyResultError } from "sequelize";
import { ApiResponse } from "../utils/response.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { parsePagination } from "../utils/pagination.js";
import { parseId } from "../utils/parse-id.js";
import { Product, Cart, CartItem } from "../models/index.js";

const PRODUCT_ATTRIBUTES = ["id", "title", "price", "description"] as const;

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const { page, limit, offset } = parsePagination(req);

    const products = await req.user.getProducts({
      attributes: [...PRODUCT_ATTRIBUTES],
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    const count = await req.user.countProducts();

    ApiResponse.paginated(res, products, page, limit, count);
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

    const id = parseId(req.params["id"], "Product");

    const product = await Product.findOne({
      attributes: [...PRODUCT_ATTRIBUTES],
      where: { id, userId: req.user.id },
      rejectOnEmpty: new NotFoundError("Product"),
      raw: true,
    });

    ApiResponse.success(res, product);
  } catch (error) {
    if (error instanceof EmptyResultError) {
      next(new NotFoundError("Product"));
      return;
    }
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

    let cart = await req.user.getCart();

    if (!cart) {
      cart = await req.user.createCart();
    }

    const cartWithItems = await Cart.findByPk(cart.get("id") as number, {
      include: [
        {
          model: Product,
          as: "items",
          attributes: ["id", "title", "price"],
          through: { attributes: ["quantity"] },
        },
      ],
    });

    ApiResponse.success(res, cartWithItems);
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

    const productId = parseId(req.body["productId"], "Product");
    const quantity = Math.max(parseInt(req.body["quantity"]) || 1, 1);

    const product = await Product.findByPk(productId);
    if (!product) throw new NotFoundError("Product");

    let cart = await req.user.getCart();
    if (!cart) {
      cart = await req.user.createCart();
    }

    const cartId = cart.get("id") as number;

    const existing = await CartItem.findOne({
      where: { cartId, productId },
    });

    if (existing) {
      const currentQty = existing.get("quantity") as number;
      await existing.update({ quantity: currentQty + quantity });
    } else {
      await CartItem.create({ cartId, productId, quantity });
    }

    const updated = await Cart.findByPk(cartId, {
      include: [
        {
          model: Product,
          as: "items",
          attributes: ["id", "title", "price"],
          through: { attributes: ["quantity"] },
        },
      ],
    });

    ApiResponse.success(res, updated, "Product added to cart");
  } catch (error) {
    next(error);
  }
};
