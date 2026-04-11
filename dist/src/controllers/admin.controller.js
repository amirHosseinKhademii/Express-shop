import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import { ApiResponse } from "../utils/response.js";
import { NotFoundError, ConflictError } from "../utils/errors.js";
import { parseId } from "../utils/parse-id.js";
import { pickDefined } from "../utils/pick-defined.js";
import { Product } from "../models/index.js";
import { sequelize } from "../utils/sequelize.js";
const ALLOWED_FIELDS = ["title", "price", "description"];
const RESPONSE_ATTRIBUTES = ["id", "title", "price", "description", "createdAt", "updatedAt"];
export const addProduct = async (req, res, next) => {
    try {
        const fields = pickDefined(req.body, ALLOWED_FIELDS);
        const product = await Product.create(fields, {
            fields: [...ALLOWED_FIELDS],
            returning: true,
        });
        const plain = await Product.findByPk(product.get("id"), {
            attributes: [...RESPONSE_ATTRIBUTES],
            raw: true,
        });
        ApiResponse.created(res, plain, "Product added");
    }
    catch (error) {
        if (error instanceof UniqueConstraintError) {
            next(new ConflictError("Product with this title already exists"));
            return;
        }
        next(error);
    }
};
export const updateProduct = async (req, res, next) => {
    try {
        const id = parseId(req.params["id"], "Product");
        const product = await Product.findOne({
            where: { id },
            rejectOnEmpty: new NotFoundError("Product"),
        });
        const fields = pickDefined(req.body, ALLOWED_FIELDS);
        if (Object.keys(fields).length > 0) {
            await product.update(fields, { fields: [...ALLOWED_FIELDS] });
        }
        const plain = await Product.findByPk(id, {
            attributes: [...RESPONSE_ATTRIBUTES],
            raw: true,
        });
        ApiResponse.success(res, plain, "Product updated");
    }
    catch (error) {
        if (error instanceof UniqueConstraintError) {
            next(new ConflictError("Product with this title already exists"));
            return;
        }
        next(error);
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const id = parseId(req.params["id"], "Product");
        const deleted = await sequelize.transaction(async (t) => {
            return Product.destroy({ where: { id }, transaction: t });
        });
        if (deleted === 0)
            throw new NotFoundError("Product");
        ApiResponse.noContent(res);
    }
    catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
            next(new ConflictError("Cannot delete product — it is referenced by other records"));
            return;
        }
        next(error);
    }
};
//# sourceMappingURL=admin.controller.js.map