import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";
import { products } from "../models/product.model.js";

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

export const addProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    products.push(req.body);
    ApiResponse.created(res, req.body, "Product added");
  } catch (error) {
    next(error);
  }
};
