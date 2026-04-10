import type { Request, Response } from "express";

interface SuccessResponse<T> {
  status: "success";
  requestId?: string;
  message?: string;
  data: T;
}

interface ErrorResponse {
  status: "error";
  requestId?: string;
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

interface PaginatedResponse<T> {
  status: "success";
  requestId?: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const isProduction = () => process.env["NODE_ENV"] === "production";

export const ApiResponse = {
  success<T>(res: Response, data: T, message?: string, statusCode = 200) {
    const body: SuccessResponse<T> = {
      status: "success",
      requestId: (res.req as Request).requestId,
      data,
    };
    if (message) body.message = message;
    return res.status(statusCode).json(body);
  },

  created<T>(res: Response, data: T, message?: string) {
    return ApiResponse.success(res, data, message, 201);
  },

  noContent(res: Response) {
    return res.status(204).send();
  },

  error(
    res: Response,
    code: string,
    message: string,
    statusCode = 500,
    details?: unknown,
    error?: Error,
  ) {
    const body: ErrorResponse = {
      status: "error",
      requestId: (res.req as Request).requestId,
      code,
      message,
    };
    if (details) body.details = details;
    if (!isProduction() && error?.stack) body.stack = error.stack;
    return res.status(statusCode).json(body);
  },

  paginated<T>(res: Response, data: T[], page: number, limit: number, total: number) {
    const body: PaginatedResponse<T> = {
      status: "success",
      requestId: (res.req as Request).requestId,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
    return res.json(body);
  },
};
