import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
// import viteConfig from "../vite.config"; // Removed: do not import Vite config at runtime
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    host: true,
  };

  const vite = await createViteServer({
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        log(`Vite error: ${msg}`, "vite");
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    log(`Processing request: ${url}`, "vite");

    try {
      const templatePath = path.resolve(process.cwd(), "client", "index.html");
      log(`Checking template path: ${templatePath}`, "vite");

      if (!fs.existsSync(templatePath)) {
        log(`Could not find client template at: ${templatePath}`, "vite");
        return res.status(404).send("Could not find client template");
      }

      let template = await fs.promises.readFile(templatePath, "utf-8");
      log(`Found template at: ${templatePath}`, "vite");

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      log(`Error processing ${url}: ${errorMessage}`, "vite");
      res.status(500).send(`Error processing request: ${errorMessage}`);
      // next(e); // Avoid passing to next middleware to prevent default error handler
    }
  });
}

export function serveStatic(app: Express) {
  // Use ESM-safe __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Try both possible locations for static files
  let staticPath = path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(staticPath)) {
    // Fallback: if running from dist/server/server, go up one more level
    staticPath = path.resolve(process.cwd(), "public");
  }
  log(`Checking static path: ${staticPath}`, "express");
  log(`Checking static path: ${staticPath}`, "express");
  log(`Checking static path: ${staticPath}`, "express");

  if (!fs.existsSync(staticPath)) {
    log(`Could not find dist/public directory at: ${staticPath}`, "express");
    return app.use((req, res) => {
      res.status(404).send("dist/public directory not found. Run `npm run build` first.");
    });
  }

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Index file not found");
    }
  });
}