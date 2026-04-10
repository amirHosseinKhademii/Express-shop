import crypto from "node:crypto";
import { ApiResponse } from "../utils/response.js";
import { products } from "../models/product.model.js";
import { NotFoundError } from "../utils/errors.js";
export const addProduct = (req, res, next) => {
    try {
        const product = {
            id: crypto.randomUUID(),
            title: req.body.title,
            price: req.body.price,
        };
        products.push(product);
        ApiResponse.created(res, product, "Product added");
    }
    catch (error) {
        next(error);
    }
};
export const updateProduct = (req, res, next) => {
    try {
        const index = products.findIndex((p) => p.id === req.params["id"]);
        if (index === -1)
            throw new NotFoundError("Product");
        products[index] = { ...products[index], ...req.body, id: products[index].id };
        ApiResponse.success(res, products[index], "Product updated");
    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = (req, res, next) => {
    try {
        const index = products.findIndex((p) => p.id === req.params["id"]);
        if (index === -1)
            throw new NotFoundError("Product");
        products.splice(index, 1);
        ApiResponse.noContent(res);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=admin.controller.js.map