import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); // Enable CORS

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Health check endpoint for Railway
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Debug route
app.get("/debug", (req, res) => {
  res.json({
    message: "Server is running",
    environment: process.env.NODE_ENV,
    cwd: process.cwd(),
    __dirname
  });
});

(async () => {
  console.log("Starting server...");
  const server = await registerRoutes(app);
  console.log("Routes registered");
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`Error: ${message} (Status: ${status})`, "express");
    res.status(status).json({ message });
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  const host = process.env.NODE_ENV === 'production' ? "0.0.0.0" : "localhost";

  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();