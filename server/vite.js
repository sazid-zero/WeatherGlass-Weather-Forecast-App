var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
// import viteConfig from "../vite.config"; // Removed: do not import Vite config at runtime
import { nanoid } from "nanoid";
import { fileURLToPath } from 'url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var viteLogger = createLogger();
export function log(message, source) {
    if (source === void 0) { source = "express"; }
    var formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    console.log("".concat(formattedTime, " [").concat(source, "] ").concat(message));
}
export function setupVite(app, server) {
    return __awaiter(this, void 0, void 0, function () {
        var serverOptions, vite;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverOptions = {
                        middlewareMode: true,
                        hmr: { server: server },
                        host: true,
                    };
                    return [4 /*yield*/, createViteServer({
                            configFile: false,
                            customLogger: __assign(__assign({}, viteLogger), { error: function (msg, options) {
                                    viteLogger.error(msg, options);
                                    log("Vite error: ".concat(msg), "vite");
                                } }),
                            server: serverOptions,
                            appType: "custom",
                        })];
                case 1:
                    vite = _a.sent();
                    app.use(vite.middlewares);
                    app.get("*", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                        var url, templatePath, template, page, e_1, errorMessage;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = req.originalUrl;
                                    log("Processing request: ".concat(url), "vite");
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 4, , 5]);
                                    templatePath = path.resolve(process.cwd(), "client", "index.html");
                                    log("Checking template path: ".concat(templatePath), "vite");
                                    if (!fs.existsSync(templatePath)) {
                                        log("Could not find client template at: ".concat(templatePath), "vite");
                                        return [2 /*return*/, res.status(404).send("Could not find client template")];
                                    }
                                    return [4 /*yield*/, fs.promises.readFile(templatePath, "utf-8")];
                                case 2:
                                    template = _a.sent();
                                    log("Found template at: ".concat(templatePath), "vite");
                                    template = template.replace("src=\"/src/main.tsx\"", "src=\"/src/main.tsx?v=".concat(nanoid(), "\""));
                                    return [4 /*yield*/, vite.transformIndexHtml(url, template)];
                                case 3:
                                    page = _a.sent();
                                    res.status(200).set({ "Content-Type": "text/html" }).end(page);
                                    return [3 /*break*/, 5];
                                case 4:
                                    e_1 = _a.sent();
                                    errorMessage = e_1 instanceof Error ? e_1.message : String(e_1);
                                    log("Error processing ".concat(url, ": ").concat(errorMessage), "vite");
                                    res.status(500).send("Error processing request: ".concat(errorMessage));
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
export function serveStatic(app) {
    // Use ESM-safe __dirname
    var __filename = fileURLToPath(import.meta.url);
    var __dirname = path.dirname(__filename);
    // Try both possible locations for static files
    var staticPath = path.resolve(process.cwd(), "dist", "public");
    if (!fs.existsSync(staticPath)) {
        // Fallback: if running from dist/server/server, go up one more level
        staticPath = path.resolve(process.cwd(), "public");
    }
    log("Checking static path: ".concat(staticPath), "express");
    log("Checking static path: ".concat(staticPath), "express");
    log("Checking static path: ".concat(staticPath), "express");
    if (!fs.existsSync(staticPath)) {
        log("Could not find dist/public directory at: ".concat(staticPath), "express");
        return app.use(function (req, res) {
            res.status(404).send("dist/public directory not found. Run `npm run build` first.");
        });
    }
    app.use(express.static(staticPath));
    app.get("*", function (_req, res) {
        var indexPath = path.join(staticPath, "index.html");
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        }
        else {
            res.status(404).send("Index file not found");
        }
    });
}
