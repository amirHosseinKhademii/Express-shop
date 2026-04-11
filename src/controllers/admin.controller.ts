import type { Request, Response, NextFunction } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { ApiResponse } from "../utils/response.js";
import { NotFoundError } from "../utils/errors.js";
import { poolPromise } from "../utils/database.js";
import { ProductRow } from "./shop.controller.js";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, price, description } = req.body;

    const [result] = await poolPromise.execute<ResultSetHeader>(
      "INSERT INTO products (title, price, description) VALUES (?, ?, ?)",
      [title, price, description],
    );

    const [rows] = await poolPromise.execute<ProductRow[]>(
      "SELECT id, title, price, description FROM products WHERE id = ?",
      [result.insertId],
    );

    ApiResponse.created(res, rows[0], "Product added");
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;
    const { title, price } = req.body;

    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (price !== undefined) {
      fields.push("price = ?");
      values.push(price);
    }

    if (fields.length === 0) {
      const [existing] = await poolPromise.execute<ProductRow[]>(
        "SELECT id, title, price, created_at, updated_at FROM products WHERE id = ?",
        [id],
      );
      if (existing.length === 0) throw new NotFoundError("Product");
      ApiResponse.success(res, existing[0], "Nothing to update");
      return;
    }

    values.push(id);

    const [result] = await poolPromise.execute<ResultSetHeader>(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.affectedRows === 0) throw new NotFoundError("Product");

    const [rows] = await poolPromise.execute<ProductRow[]>(
      "SELECT id, title, price, created_at, updated_at FROM products WHERE id = ?",
      [id],
    );

    ApiResponse.success(res, rows[0], "Product updated");
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;

    const [result] = await poolPromise.execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) throw new NotFoundError("Product");

    ApiResponse.noContent(res);
  } catch (error) {
    next(error);
  }
};
