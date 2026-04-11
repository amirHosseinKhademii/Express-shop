import type { Request, Response, NextFunction } from "express";
import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} from "sequelize";
import { ApiResponse } from "../utils/response.js";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from "../utils/errors.js";
import { parseId } from "../utils/parse-id.js";
import { pickDefined } from "../utils/pick-defined.js";
import { Product } from "../models/index.js";
import { sequelize } from "../utils/sequelize.js";

const ALLOWED_FIELDS = ["title", "price", "description"] as const;
const RESPONSE_ATTRIBUTES = [
  "id",
  "userId",
  "title",
  "price",
  "description",
  "createdAt",
  "updatedAt",
] as const;

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const fields = pickDefined(req.body, ALLOWED_FIELDS);

    const created = await req.user.createProduct(fields, {
      fields: [...ALLOWED_FIELDS],
    });

    const plain = await Product.findByPk(created.get("id") as number, {
      attributes: [...RESPONSE_ATTRIBUTES],
      raw: true,
    });

    ApiResponse.created(res, plain, "Product added");
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      next(new ConflictError("Product with this title already exists"));
      return;
    }
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const id = parseId(req.params["id"], "Product");

    const product = await Product.findOne({
      where: { id },
      rejectOnEmpty: new NotFoundError("Product"),
    });

    if (product.get("userId") !== req.user.id) {
      throw new ForbiddenError("You can only update your own products");
    }

    const fields = pickDefined(req.body, ALLOWED_FIELDS);

    if (Object.keys(fields).length > 0) {
      await product.update(fields, { fields: [...ALLOWED_FIELDS] });
    }

    const plain = await Product.findByPk(id, {
      attributes: [...RESPONSE_ATTRIBUTES],
      raw: true,
    });

    ApiResponse.success(res, plain, "Product updated");
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      next(new ConflictError("Product with this title already exists"));
      return;
    }
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) throw new UnauthorizedError("Authentication required");

    const id = parseId(req.params["id"], "Product");

    const product = await Product.findOne({
      where: { id },
      rejectOnEmpty: new NotFoundError("Product"),
    });

    if (product.get("userId") !== req.user.id) {
      throw new ForbiddenError("You can only delete your own products");
    }

    await sequelize.transaction(async (t) => {
      await product.destroy({ transaction: t });
    });

    ApiResponse.noContent(res);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      next(
        new ConflictError(
          "Cannot delete product — it is referenced by other records",
        ),
      );
      return;
    }
    next(error);
  }
};
