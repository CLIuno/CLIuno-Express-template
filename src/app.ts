import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";

import "module-alias/register";
import { initializeDataSource } from "@/database/app-data-source";
import router from "@/routers";

dotenv.config();

// Create an Express application
const APP: Express = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

APP.use(express.json());
APP.set("trust proxy", 1); // Trust first proxy
APP.use(
    session({
        secret: process.env.SESSION_SECRET || "very-secret-key",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 86400000,
            httpOnly: true,
        },
    }),
);

if (process.env.NODE_ENV === "development") {
    APP.use(morgan("dev"));
    APP.use(
        cors({
            origin: "*",
        }),
    );
}

if (process.env.NODE_ENV === "production") {
    APP.use(helmet());
    APP.use(
        cors({
            origin: process.env.APP_URL,
        }),
    );
}

APP.use(`/api/${process.env.API_VERSION}`, router);
APP.use("/public", express.static(path.join(__dirname, "../public")));
APP.get("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

APP.disable("x-powered-by");
// Establish database connection and start the server
initializeDataSource().then(() =>
    createServer(APP).listen(PORT, () =>
        console.log(`Listening on ${process.env.APP_URL}:${PORT}`),
    ),
);
