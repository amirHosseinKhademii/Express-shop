import { ApiResponse } from "../utils/response.js";
import { UnauthorizedError } from "../utils/errors.js";
import { parsePagination } from "../utils/pagination.js";
import { parseId } from "../utils/parse-id.js";
import { getUserProducts, getUserProductById, } from "../services/product.service.js";
import { getOrCreateCart, loadCartWithItems, addItemToCart, removeItemFromCart, } from "../services/cart.service.js";
export const getProducts = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const { page, limit, offset } = parsePagination(req);
        const { rows, count } = await getUserProducts(req.user, { limit, offset });
        ApiResponse.paginated(res, rows, page, limit, count);
    }
    catch (error) {
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const id = parseId(req.params["id"], "Product");
        const product = await getUserProductById(req.user.id, id);
        ApiResponse.success(res, product);
    }
    catch (error) {
        next(error);
    }
};
export const getCart = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const cart = await getOrCreateCart(req.user);
        const cartWithItems = await loadCartWithItems(cart);
        ApiResponse.success(res, cartWithItems);
    }
    catch (error) {
        next(error);
    }
};
export const addProductToCart = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const productId = parseId(req.body["productId"], "Product");
        const quantity = Math.max(parseInt(req.body["quantity"]) || 1, 1);
        const cart = await getOrCreateCart(req.user);
        const updated = await addItemToCart(cart, productId, quantity);
        ApiResponse.success(res, updated, "Product added to cart");
    }
    catch (error) {
        next(error);
    }
};
export const removeProductFromCart = async (req, res, next) => {
    try {
        if (!req.user)
            throw new UnauthorizedError("Authentication required");
        const productId = parseId(req.body["productId"], "Product");
        const quantity = Math.max(parseInt(req.body["quantity"]) || 1, 1);
        const cart = await getOrCreateCart(req.user);
        const updated = await removeItemFromCart(cart, productId, quantity);
        ApiResponse.success(res, updated, "Product removed from cart");
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=shop.controller.js.map