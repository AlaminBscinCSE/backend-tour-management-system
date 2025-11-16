/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const mainServer = async () => {
    try {
        await mongoose.connect(envVars.db_url as string);
        console.log("DB connected successfully!");

        server = app.listen(Number(envVars.port), () => {
            console.log(`Server running on port ${envVars.port}`);
        });
    } catch (error) {
        console.log("mainServerError:", error);
        process.exit(1);
    }
};

mainServer();

// -------- Graceful Shutdown Handlers --------

const shutdown = (message: string, err?: unknown) => {
    console.log(`${message}`, err || "");
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
};

process.on("SIGTERM", () => shutdown("SIGTERM detected... shutting down!"));

process.on("unhandledRejection", (err) =>
    shutdown("Unhandled Rejection detected... shutting down!", err)
);

process.on("uncaughtException", (err) =>
    shutdown("Uncaught Exception detected... shutting down!", err)
);
