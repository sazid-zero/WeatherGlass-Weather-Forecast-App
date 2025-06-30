
import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';

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
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Try multiple paths for the client template
      const possiblePaths = [
        path.join(process.cwd(), "client", "index.html"),
        path.join(process.cwd(), "..", "client", "index.html"),
        "./client/index.html"
      ];

      let template = '';
      let templateFound = false;

      for (const templatePath of possiblePaths) {
        try {
          template = await fs.promises.readFile(templatePath, "utf-8");
          templateFound = true;
          break;
        } catch (e) {
          continue;
        }
      }

      if (!templateFound) {
        throw new Error("Could not find client template");
      }

      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible static file locations
  const possiblePaths = [
    path.join(process.cwd(), "dist", "public"),
    path.join(process.cwd(), "dist"),
    "./dist/public",
    "./dist"
  ];

  let staticPath = '';
  let pathFound = false;

  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      staticPath = testPath;
      pathFound = true;
      break;
    }
  }

  if (!pathFound) {
    throw new Error(
      `Could not find dist directory. Tried: ${possiblePaths.join(', ')}. Make sure to build the client first.`,
    );
  }

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(path.resolve(indexPath));
    } else {
      res.status(404).send("Index file not found");
    }
  });
}
