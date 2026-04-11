import { EmptyResultError } from "sequelize";
import { ApiResponse } from "../utils/response.js";
import { NotFoundError } from "../utils/errors.js";
import { parsePagination } from "../utils/pagination.js";
import { parseId } from "../utils/parse-id.js";
import { Product } from "../models/product.model.js";
const PRODUCT_ATTRIBUTES = ["id", "title", "price", "description"];
export const getProducts = async (req, res, next) => {
    try {
        const { page, limit, offset } = parsePagination(req);
        const { count, rows } = await Product.findAndCountAll({
            attributes: [...PRODUCT_ATTRIBUTES],
            order: [["id", "ASC"]],
            limit,
            offset,
            raw: true,
        });
        ApiResponse.paginated(res, rows, page, limit, count);
    }
    catch (error) {
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    try {
        const id = parseId(req.params["id"], "Product");
        const product = await Product.findOne({
            attributes: [...PRODUCT_ATTRIBUTES],
            where: { id },
            rejectOnEmpty: new NotFoundError("Product"),
            raw: true,
        });
        ApiResponse.success(res, product);
    }
    catch (error) {
        if (error instanceof EmptyResultError) {
            next(new NotFoundError("Product"));
            return;
        }
        next(error);
    }
};
export const getCart = (_req, res, next) => {
    try {
        // ApiResponse.success(res, carts);
        ApiResponse.success(res, []);
    }
    catch (error) {
        next(error);
    }
};
export const addProductToCart = (req, res, next) => {
    try {
        // const productId = req.body["productId"];
        // const cartId = req.params["cartId"];
        // const cart = carts.find((c) => c.id === cartId);
        // if (!cart) throw new NotFoundError("Cart");
        // const product = products.find((p) => p.id === productId);
        // if (!product) throw new NotFoundError("Product");
        // //find existing product in cart
        // const existingProduct = cart?.products.find(
        //   (p) => p.product.id === productId,
        // );
        // if (existingProduct) {
        //   existingProduct.quantity += 1;
        //   cart.total += product.price;
        //   ApiResponse.success(res, existingProduct);
        //   return;
        // }
        // cart.products.push({ product, quantity: 1 });
        // cart.total += product.price;
        // ApiResponse.success(res, cart);
        ApiResponse.success(res, []);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=shop.controller.js.map