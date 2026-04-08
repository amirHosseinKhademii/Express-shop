import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
export declare const validateRequest: (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate-request.d.ts.map