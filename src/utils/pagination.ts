import type { Request } from "express";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(
  req: Request,
  maxLimit = MAX_LIMIT,
  defaultLimit = DEFAULT_LIMIT,
): PaginationParams {
  const page = Math.max(parseInt(req.query["page"] as string) || DEFAULT_PAGE, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query["limit"] as string) || defaultLimit, 1),
    maxLimit,
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
