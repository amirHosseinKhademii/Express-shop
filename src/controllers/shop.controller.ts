import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";
import { products, carts } from "../models/product.model.js";
import { NotFoundError } from "../utils/errors.js";

export const getProducts = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    ApiResponse.success(res, products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const product = products.find((p) => p.id === req.params["id"]);
    if (!product) throw new NotFoundError("Product");
    ApiResponse.success(res, product);
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
    const product = products.find((p) => p.id === req.body["productId"]);
    const cart = carts.find((c) => c.id === req.params["cartId"]);
    if (!product) throw new NotFoundError("Product");
    if (!cart) throw new NotFoundError("Cart");
    cart.products.push(product);
    ApiResponse.success(res, product);
  } catch (error) {
    next(error);
  }
};
