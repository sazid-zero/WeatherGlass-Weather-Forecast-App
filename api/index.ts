import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic health check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Helper to ensure routes are registered only once
let routesRegistered = false;

export default async function handler(req: Request, res: Response) {
  if (!routesRegistered) {
    await registerRoutes(app);
    routesRegistered = true;
  }
  
  // Forward the request to Express
  app(req, res);
}
