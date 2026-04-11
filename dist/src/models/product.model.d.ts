export interface Product {
    id: string;
    title: string;
    price: number;
}
export declare const products: Product[];
export interface Cart {
    id: string;
    products: {
        product: Product;
        quantity: number;
    }[];
    total: number;
}
export declare const carts: Cart[];
//# sourceMappingURL=product.model.d.ts.map