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
    db_url: getEnv("DB_URL") as string,
    port: getEnv("PORT") as string,
    jwt_access_secret: getEnv("JWT_ACCESS_SECRET") as string,
    jwt_access_expires: getEnv("JWT_ACCESS_EXPIRES") as string,
    bcrypt_salt_round: getEnv("BCRYPT_SALT_ROUND") as string,
    super_admin_email: getEnv("SUPER_ADMIN_EMAIL") as string,
    super_admin_password: getEnv("SUPER_ADMIN_PASSWORD") as string,
    jwt_refresh_secret: getEnv("JWT_REFRESH_SECRET") as string,
    jwt_refresh_expires: getEnv("JWT_REFRESH_EXPIRES") as string,
    google_Client_Id: getEnv("GOOGLE_CLIENT_ID") as string,
    google_Client_Secret: getEnv("GOOGLE_CLIENT_SECRET") as string,
    google_Callback_Url: getEnv("GOOGLE_CALLBACK_URL") as string,
    express_session_Secret: getEnv("EXPRESS_SESSION_SECRET") as string,
    Frontend_Url: getEnv("FRONTEND_URL") as string,
};
