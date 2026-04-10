import crypto from "node:crypto";

export interface Product {
  id: string;
  title: string;
  price: number;
}

export const products: Product[] = [
  { id: crypto.randomUUID(), title: "Product 1", price: 100 },
  { id: crypto.randomUUID(), title: "Product 2", price: 200 },
];
