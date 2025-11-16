import dotenv from "dotenv";
dotenv.config();

const getEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${name}`);
    }
    return value;
};

export const envVars = {
    node_env: (process.env.NODE_ENV as "development" | "production") || "development",
    db_url: getEnv("DB_URL"),
    port: getEnv("PORT")
};
