import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";
import { products } from "../models/product.model.js";
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
