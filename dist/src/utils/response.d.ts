import type { Response } from "express";
export declare const ApiResponse: {
    success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    created<T>(res: Response, data: T, message?: string): Response<any, Record<string, any>>;
    noContent(res: Response): Response<any, Record<string, any>>;
    error(res: Response, code: string, message: string, statusCode?: number, details?: unknown): Response<any, Record<string, any>>;
    paginated<T>(res: Response, data: T[], page: number, limit: number, total: number): Response<any, Record<string, any>>;
};
//# sourceMappingURL=response.d.ts.map