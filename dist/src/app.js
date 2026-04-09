import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import { apiLimiter } from "./middleware/rate-limit.js";
import { requestTimeout } from "./middleware/timeout.js";
import { errorHandler } from "./middleware/error-handler.js";
import { requestLogger } from "./middleware/request-logger.js";
import routes from "./routes/index.js";
export const createApp = () => {
    const app = express();
    // Hides "Express" from the X-Powered-By header so attackers can't
    // fingerprint the framework and target known Express vulnerabilities.
    app.disable("x-powered-by");
    // Helmet sets ~15 security HTTP headers in one call:
    // - CSP defaultSrc:'self' — only allow loading resources from this origin
    // - COEP: true — blocks cross-origin resources that don't opt in (prevents Spectre-style leaks)
    // - CORP: same-origin — prevents other sites from embedding our responses
    // Also sets X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.
    app.use(helmet({
        contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
        crossOriginEmbedderPolicy: true,
        crossOriginResourcePolicy: { policy: "same-origin" },
    }));
    // CORS: restrict which domains can call this API. Reads comma-separated
    // origins from ALLOWED_ORIGINS env var; falls back to "*" (open) in dev.
    // credentials:true allows cookies/auth headers. maxAge caches preflight for 24h.
    app.use(cors({
        origin: process.env["ALLOWED_ORIGINS"]?.split(",") ?? "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        maxAge: 86400,
    }));
    // Gzip/Brotli compress responses to reduce payload size over the wire
    app.use(compression());
    // Parse JSON and URL-encoded bodies. limit:"10mb" prevents oversized payloads
    // from consuming memory (default is 100kb — 10mb is generous for file uploads).
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));
    // HPP: blocks HTTP Parameter Pollution — duplicate query params like
    // ?sort=name&sort=email get collapsed so downstream code sees a single value.
    app.use(hpp());
    // Strips MongoDB operators ($gt, $ne, etc.) from req.body/query/params
    // to prevent NoSQL injection attacks against Mongoose queries.
    app.use(mongoSanitize());
    // If any request (including slow DB queries) exceeds 10s, respond with 503
    // instead of letting the connection hang and exhaust the server's socket pool.
    app.use(requestTimeout(10000));
    // Assigns a unique requestId and logs method/path/status/duration on finish
    app.use(requestLogger);
    // Mount all /api routes behind the rate limiter:
    // 100 requests per 15 min per IP. Prevents brute-force and abuse.
    app.use("/api", apiLimiter, routes);
    // Centralized error handler — must be registered LAST so it catches
    // errors thrown or passed via next(err) from any middleware/route above.
    app.use(errorHandler);
    return app;
};
//# sourceMappingURL=app.js.map