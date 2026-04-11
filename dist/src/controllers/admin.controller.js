import { ApiResponse } from "../utils/response.js";
import { NotFoundError } from "../utils/errors.js";
import { poolPromise } from "../utils/database.js";
export const addProduct = async (req, res, next) => {
    try {
        const { title, price } = req.body;
        const [result] = await poolPromise.execute("INSERT INTO products (title, price) VALUES (?, ?)", [title, price]);
        const [rows] = await poolPromise.execute("SELECT id, title, price, created_at, updated_at FROM products WHERE id = ?", [result.insertId]);
        ApiResponse.created(res, rows[0], "Product added");
    }
    catch (error) {
        next(error);
    }
};
export const updateProduct = async (req, res, next) => {
    try {
        const id = req.params["id"];
        const { title, price } = req.body;
        const fields = [];
        const values = [];
        if (title !== undefined) {
            fields.push("title = ?");
            values.push(title);
        }
        if (price !== undefined) {
            fields.push("price = ?");
            values.push(price);
        }
        if (fields.length === 0) {
            const [existing] = await poolPromise.execute("SELECT id, title, price, created_at, updated_at FROM products WHERE id = ?", [id]);
            if (existing.length === 0)
                throw new NotFoundError("Product");
            ApiResponse.success(res, existing[0], "Nothing to update");
            return;
        }
        values.push(id);
        const [result] = await poolPromise.execute(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, values);
        if (result.affectedRows === 0)
            throw new NotFoundError("Product");
        const [rows] = await poolPromise.execute("SELECT id, title, price, created_at, updated_at FROM products WHERE id = ?", [id]);
        ApiResponse.success(res, rows[0], "Product updated");
    }
    catch (error) {
        next(error);
    }
};
export const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params["id"];
        const [result] = await poolPromise.execute("DELETE FROM products WHERE id = ?", [id]);
        if (result.affectedRows === 0)
            throw new NotFoundError("Product");
        ApiResponse.noContent(res);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=admin.controller.js.map