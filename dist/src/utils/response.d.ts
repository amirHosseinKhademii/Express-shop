import type { Response } from "express";
export declare const ApiResponse: {
    success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    created<T>(res: Response, data: T, message?: string): Response<any, Record<string, any>>;
    noContent(res: Response): Response<any, Record<string, any>>;
    error(res: Response, code: string, message: string, statusCode?: number, details?: unknown, error?: Error): Response<any, Record<string, any>>;
    paginated<T>(res: Response, data: T[], page: number, limit: number, total: number): Response<any, Record<string, any>>;
    notFound(res: Response, message: string): Response<any, Record<string, any>>;
    badRequest(res: Response, message: string): Response<any, Record<string, any>>;
    unauthorized(res: Response, message: string): Response<any, Record<string, any>>;
    forbidden(res: Response, message: string): Response<any, Record<string, any>>;
    internalServerError(res: Response, message: string): Response<any, Record<string, any>>;
    serviceUnavailable(res: Response, message: string): Response<any, Record<string, any>>;
    gatewayTimeout(res: Response, message: string): Response<any, Record<string, any>>;
};
//# sourceMappingURL=response.d.ts.map