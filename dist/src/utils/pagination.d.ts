import type { Request } from "express";
export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}
export declare function parsePagination(req: Request, maxLimit?: number, defaultLimit?: number): PaginationParams;
//# sourceMappingURL=pagination.d.ts.map