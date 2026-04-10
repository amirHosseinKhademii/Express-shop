import { ApiResponse } from "../utils/response.js";
import { products } from "../models/product.model.js";
export const getProducts = (_req, res, next) => {
    try {
        ApiResponse.success(res, products);
    }
    catch (error) {
        next(error);
    }
};
export const addProduct = (req, res, next) => {
    try {
        products.push(req.body);
        ApiResponse.created(res, req.body, "Product added");
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=shop.controller.js.map