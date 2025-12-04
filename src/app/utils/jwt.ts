import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (payload: JwtPayload, secret: string, expiresTime: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn: expiresTime,
    } as SignOptions);
    return token
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret)
}