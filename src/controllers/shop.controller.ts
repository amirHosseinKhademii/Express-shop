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
