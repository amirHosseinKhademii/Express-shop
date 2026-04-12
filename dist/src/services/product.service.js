import { ObjectId } from "mongodb";
import { Product } from "../models/index.js";
import { sequelize } from "../database/sequelize.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";
import { pickDefined } from "../utils/pick-defined.js";
import { mdb } from "../database/mongodb.js";
export const PRODUCT_ATTRIBUTES = [
    "id",
    "title",
    "price",
    "description",
];
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
const products = () => mdb.collection("products");
const PRODUCT_PROJECTION = {
    _id: 1,
    userId: 1,
    title: 1,
    price: 1,
    description: 1,
    createdAt: 1,
    updatedAt: 1,
};
export async function getUserProductsMdb(user, options) {
    const filter = { userId: user.id };
    const [rows, count] = await Promise.all([
        products()
            .find(filter, { projection: PRODUCT_PROJECTION })
            .sort({ _id: 1 })
            .skip(options.offset)
            .limit(options.limit)
            .toArray(),
        products().countDocuments(filter),
    ]);
    return { rows, count };
}
export async function getUserProductByIdMdb(user, productId) {
    const product = await products().findOne({ _id: new ObjectId(productId), userId: user.id }, { projection: PRODUCT_PROJECTION });
    if (!product)
        throw new NotFoundError("Product");
    return product;
}
export async function createProductMdb(user, body) {
    const fields = pickDefined(body, ALLOWED_FIELDS);
    const now = new Date();
    const doc = {
        userId: user.id,
        title: fields.title,
        price: fields.price,
        description: fields.description ?? null,
        createdAt: now,
        updatedAt: now,
    };
    const result = await products().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}
export async function updateProductMdb(user, productId, body) {
    const fields = pickDefined(body, ALLOWED_FIELDS);
    if (Object.keys(fields).length === 0) {
        return getUserProductByIdMdb(user, productId);
    }
    const result = await products().findOneAndUpdate({ _id: new ObjectId(productId), userId: user.id }, { $set: { ...fields, updatedAt: new Date() } }, { returnDocument: "after", projection: PRODUCT_PROJECTION });
    if (!result)
        throw new NotFoundError("Product");
    return result;
}
export async function deleteProductMdb(user, productId) {
    const result = await products().findOneAndDelete({ _id: new ObjectId(productId), userId: user.id });
    if (!result)
        throw new NotFoundError("Product");
}
//# sourceMappingURL=product.service.js.map