import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { ApiResponse } from "../utils/response.js";
import { products, type Product } from "../models/product.model.js";
import { NotFoundError } from "../utils/errors.js";

export const addProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const product: Product = {
      id: crypto.randomUUID(),
      title: req.body.title,
      price: req.body.price,
    };
    products.push(product);
    ApiResponse.created(res, product, "Product added");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const index = products.findIndex((p) => p.id === req.params["id"]);
    if (index === -1) throw new NotFoundError("Product");

    products[index] = { ...products[index]!, ...req.body, id: products[index]!.id };
    ApiResponse.success(res, products[index], "Product updated");
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const index = products.findIndex((p) => p.id === req.params["id"]);
    if (index === -1) throw new NotFoundError("Product");

    products.splice(index, 1);
    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
};
