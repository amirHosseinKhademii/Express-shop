import type { Model, FindOptions, CreateOptions, DestroyOptions } from "sequelize";

interface UserAttributes {
  id: number;
  email: string;
  name: string;
}

type UserInstance = Model<UserAttributes, Partial<UserAttributes>> &
  UserAttributes & {
    getProducts: (options?: FindOptions) => Promise<Model[]>;
    createProduct: (
      values: Record<string, unknown>,
      options?: CreateOptions,
    ) => Promise<Model>;
    countProducts: (options?: FindOptions) => Promise<number>;
    hasProduct: (product: Model | number, options?: FindOptions) => Promise<boolean>;
    removeProduct: (product: Model | number, options?: DestroyOptions) => Promise<void>;
    getCart: (options?: FindOptions) => Promise<Model | null>;
    createCart: (
      values?: Record<string, unknown>,
      options?: CreateOptions,
    ) => Promise<Model>;
    getOrders: (options?: FindOptions) => Promise<Model[]>;
    createOrder: (
      values?: Record<string, unknown>,
      options?: CreateOptions,
    ) => Promise<Model>;
    countOrders: (options?: FindOptions) => Promise<number>;
  };

declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
      requestId?: string;
    }
  }
}

export {};
