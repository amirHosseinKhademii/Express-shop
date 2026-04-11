import { ApiResponse } from "../utils/response.js";
import { carts, products } from "../models/product.model.js";
import { NotFoundError } from "../utils/errors.js";
import { poolPromise } from "../utils/database.js";
export const getProducts = async (_req, res, next) => {
    try {
        const [rows] = await poolPromise.execute("SELECT id, title, price, description FROM products");
        ApiResponse.success(res, rows);
    }
    catch (error) {
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    try {
        const id = req.params["id"];
        const [rows] = await poolPromise.execute("SELECT id, title, price, description FROM products WHERE id = ?", [id]);
        if (rows.length === 0)
            throw new NotFoundError("Product");
        ApiResponse.success(res, rows[0]);
    }
    catch (error) {
        next(error);
    }
};
export const getCart = (_req, res, next) => {
    try {
        ApiResponse.success(res, carts);
    }
    catch (error) {
        next(error);
    }
};
export const addProductToCart = (req, res, next) => {
    try {
        const productId = req.body["productId"];
        const cartId = req.params["cartId"];
        const cart = carts.find((c) => c.id === cartId);
        if (!cart)
            throw new NotFoundError("Cart");
        const product = products.find((p) => p.id === productId);
        if (!product)
            throw new NotFoundError("Product");
        //find existing product in cart
        const existingProduct = cart?.products.find((p) => p.product.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
            cart.total += product.price;
            ApiResponse.success(res, existingProduct);
            return;
        }
        cart.products.push({ product, quantity: 1 });
        cart.total += product.price;
        ApiResponse.success(res, cart);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=shop.controller.js.map