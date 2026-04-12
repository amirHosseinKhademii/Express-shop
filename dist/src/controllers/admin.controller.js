import { ForeignKeyConstraintError, UniqueConstraintError, } from "sequelize";
import { ApiResponse } from "../utils/response.js";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";
import { parseId } from "../utils/parse-id.js";
import { createProduct, updateProduct as updateProductService, deleteProduct as deleteProductService, } from "../services/product.service.js";
export const addProduct = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const product = await createProduct(req.user, req.body);
        ApiResponse.created(res, product, "Product added");
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
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const id = parseId(req.params["id"], "Product");
        const product = await updateProductService(req.user, id, req.body);
        ApiResponse.success(res, product, "Product updated");
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
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const id = parseId(req.params["id"], "Product");
        await deleteProductService(req.user, id);
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