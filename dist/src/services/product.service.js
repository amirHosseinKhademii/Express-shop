import { Product } from "../models/index.js";
import { sequelize } from "../utils/sequelize.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { pickDefined } from "../utils/pick-defined.js";
export const PRODUCT_ATTRIBUTES = ["id", "title", "price", "description"];
const ALLOWED_FIELDS = ["title", "price", "description"];
const RESPONSE_ATTRIBUTES = [
    "id",
    "userId",
    "title",
    "price",
    "description",
    "createdAt",
    "updatedAt",
];
export async function getUserProducts(user, options) {
    const [rows, count] = await Promise.all([
        user.getProducts({
            attributes: [...PRODUCT_ATTRIBUTES],
            order: [["id", "ASC"]],
            limit: options.limit,
            offset: options.offset,
        }),
        user.countProducts(),
    ]);
    return { rows, count };
}
export async function getUserProductById(user, productId) {
    const owns = await user.hasProduct(productId);
    if (!owns)
        throw new NotFoundError("Product");
    const product = await Product.findByPk(productId, {
        attributes: [...PRODUCT_ATTRIBUTES],
        raw: true,
    });
    if (!product)
        throw new NotFoundError("Product");
    return product;
}
export async function createProduct(user, body) {
    const fields = pickDefined(body, ALLOWED_FIELDS);
    const created = await user.createProduct(fields, {
        fields: [...ALLOWED_FIELDS],
    });
    const plain = await Product.findByPk(created.id, {
        attributes: [...RESPONSE_ATTRIBUTES],
        raw: true,
    });
    if (!plain)
        throw new NotFoundError("Product");
    return plain;
}
async function findOwnedProduct(user, productId) {
    const owns = await user.hasProduct(productId);
    if (!owns)
        throw new ForbiddenError("You can only modify your own products");
    const product = await Product.findByPk(productId, {
        rejectOnEmpty: new NotFoundError("Product"),
    });
    return product;
}
export async function updateProduct(user, productId, body) {
    const product = await findOwnedProduct(user, productId);
    const fields = pickDefined(body, ALLOWED_FIELDS);
    if (Object.keys(fields).length > 0) {
        await product.update(fields, { fields: [...ALLOWED_FIELDS] });
    }
    const plain = await Product.findByPk(productId, {
        attributes: [...RESPONSE_ATTRIBUTES],
        raw: true,
    });
    if (!plain)
        throw new NotFoundError("Product");
    return plain;
}
export async function deleteProduct(user, productId) {
    const product = await findOwnedProduct(user, productId);
    await sequelize.transaction(async (t) => {
        await product.destroy({ transaction: t });
    });
}
//# sourceMappingURL=product.service.js.map