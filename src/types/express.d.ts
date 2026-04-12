import type {
  Model,
  FindOptions,
  CreateOptions,
  DestroyOptions,
  Transaction,
} from "sequelize";

// ─── Attribute interfaces ────────────────────────────────────────

interface UserAttributes {
  id: number;
  email: string;
  name: string;
}

interface ProductAttributes {
  id: number;
  userId: number;
  title: string;
  price: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CartAttributes {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

interface OrderAttributes {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
}

// ─── Association options ─────────────────────────────────────────

interface ThroughOptions {
  through?: Record<string, unknown>;
  transaction?: Transaction;
}

// ─── Model instances ─────────────────────────────────────────────

type ProductInstance = Model<ProductAttributes, Partial<ProductAttributes>> &
  ProductAttributes & {
    orderItem?: { quantity: number };
    cartItem?: CartItemInstance;
    getCreator: (options?: FindOptions) => Promise<UserInstance>;
    getOrders: (options?: FindOptions) => Promise<OrderInstance[]>;
    getCarts: (options?: FindOptions) => Promise<CartInstance[]>;
  };

type CartItemInstance = Model<
  CartItemAttributes,
  Partial<CartItemAttributes>
> &
  CartItemAttributes;

type OrderItemInstance = Model<
  OrderItemAttributes,
  Partial<OrderItemAttributes>
> &
  OrderItemAttributes;

type CartInstance = Model<CartAttributes, Partial<CartAttributes>> &
  CartAttributes & {
    getItems: (options?: FindOptions) => Promise<ProductInstance[]>;
    addItem: (
      product: ProductInstance | number,
      options?: ThroughOptions,
    ) => Promise<void>;
    removeItem: (
      product: ProductInstance | number,
      options?: DestroyOptions,
    ) => Promise<void>;
    countItems: (options?: FindOptions) => Promise<number>;
    getOwner: (options?: FindOptions) => Promise<UserInstance>;
  };

type OrderInstance = Model<OrderAttributes, Partial<OrderAttributes>> &
  OrderAttributes & {
    addProduct: (
      product: ProductInstance | number,
      options?: ThroughOptions,
    ) => Promise<void>;
    addProducts: (
      products: (ProductInstance | number)[],
      options?: ThroughOptions,
    ) => Promise<void>;
    getProducts: (options?: FindOptions) => Promise<ProductInstance[]>;
    removeProduct: (
      product: ProductInstance | number,
      options?: DestroyOptions,
    ) => Promise<void>;
    countProducts: (options?: FindOptions) => Promise<number>;
    getUser: (options?: FindOptions) => Promise<UserInstance>;
  };

type UserInstance = Model<UserAttributes, Partial<UserAttributes>> &
  UserAttributes & {
    getProducts: (options?: FindOptions) => Promise<ProductInstance[]>;
    createProduct: (
      values: Record<string, unknown>,
      options?: CreateOptions,
    ) => Promise<ProductInstance>;
    countProducts: (options?: FindOptions) => Promise<number>;
    hasProduct: (
      product: ProductInstance | number,
      options?: FindOptions,
    ) => Promise<boolean>;
    removeProduct: (
      product: ProductInstance | number,
      options?: DestroyOptions,
    ) => Promise<void>;
    getCart: (options?: FindOptions) => Promise<CartInstance | null>;
    createCart: (
      values?: Record<string, unknown>,
      options?: CreateOptions,
    ) => Promise<CartInstance>;
    getOrders: (options?: FindOptions) => Promise<OrderInstance[]>;
    createOrder: (
      values?: Record<string, unknown>,
      options?: CreateOptions,
    ) => Promise<OrderInstance>;
    countOrders: (options?: FindOptions) => Promise<number>;
  };

// ─── Express augmentation ────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
      requestId?: string;
    }
  }
}

export type {
  UserInstance,
  ProductInstance,
  CartInstance,
  CartItemInstance,
  OrderInstance,
  OrderItemInstance,
};
