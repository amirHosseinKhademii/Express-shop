import type { Request, Response } from "express";

interface HealthResponse {
  status: "ok" | "degraded";
  timestamp: string;
  uptime: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
  };
}

export const getHealth = (_req: Request, res: Response<HealthResponse>) => {
  const { heapUsed, heapTotal, rss } = process.memoryUsage();

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: { heapUsed, heapTotal, rss },
  });
};
