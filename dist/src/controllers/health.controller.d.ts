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
export declare const getHealth: (_req: Request, res: Response<HealthResponse>) => void;
export {};
//# sourceMappingURL=health.controller.d.ts.map