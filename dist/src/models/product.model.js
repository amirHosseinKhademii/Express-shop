import crypto from "node:crypto";
export const products = [
    { id: crypto.randomUUID(), title: "Product 1", price: 100 },
    { id: crypto.randomUUID(), title: "Product 2", price: 200 },
];
export const carts = [
    { id: crypto.randomUUID(), products: [], total: 0 },
];
//# sourceMappingURL=product.model.js.map