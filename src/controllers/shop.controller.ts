import type { Request, Response, NextFunction } from "express";
import type { RowDataPacket } from "mysql2";
import { ApiResponse } from "../utils/response.js";
import { carts, products } from "../models/product.model.js";
import { NotFoundError } from "../utils/errors.js";
import { poolPromise } from "../utils/database.js";

export interface ProductRow extends RowDataPacket {
  id: number;
  title: string;
  price: number;
  description: string;
}

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [rows] = await poolPromise.execute<ProductRow[]>(
      "SELECT id, title, price, description FROM products",
    );
    ApiResponse.success(res, rows);
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
    const id = req.params["id"] as string;

    const [rows] = await poolPromise.execute<ProductRow[]>(
      "SELECT id, title, price, description FROM products WHERE id = ?",
      [id],
    );

    if (rows.length === 0) throw new NotFoundError("Product");
    ApiResponse.success(res, rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getCart = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    ApiResponse.success(res, carts);
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const productId = req.body["productId"];
    const cartId = req.params["cartId"];

    const cart = carts.find((c) => c.id === cartId);
    if (!cart) throw new NotFoundError("Cart");

    const product = products.find((p) => p.id === productId);
    if (!product) throw new NotFoundError("Product");

    //find existing product in cart
    const existingProduct = cart?.products.find(
      (p) => p.product.id === productId,
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
      cart.total += product.price;
      ApiResponse.success(res, existingProduct);
      return;
    }

    cart.products.push({ product, quantity: 1 });
    cart.total += product.price;
    ApiResponse.success(res, cart);
  } catch (error) {
    next(error);
  }
};
