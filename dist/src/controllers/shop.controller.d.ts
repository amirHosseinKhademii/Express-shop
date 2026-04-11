import type { Request, Response, NextFunction } from "express";
export declare const getProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCart: (_req: Request, res: Response, next: NextFunction) => void;
export declare const addProductToCart: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=shop.controller.d.ts.map