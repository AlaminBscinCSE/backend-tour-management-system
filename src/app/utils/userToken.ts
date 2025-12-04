import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface"
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../error/AppError";

export const createUserTokens = (payload: Partial<IUser>) => {
    const authInfo = {
        userId: payload._id,
        email: payload.email,
        role: payload.role
    }

    const accessToken = generateToken(authInfo, envVars.jwt_access_secret, envVars.jwt_access_expires);
    const refreshToken = generateToken(authInfo, envVars.jwt_refresh_secret, envVars.jwt_refresh_expires);

    return {
        accessToken,
        refreshToken
    }
}


export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.jwt_refresh_secret) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!")
    }
    if (isUserExist?.isActive === IsActive.BLOCKED || isUserExist?.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is  ${isUserExist?.isActive}`)
    }

    if (isUserExist?.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!")
    }

    const jwtPayload = {
        userId: isUserExist?._id,
        email: isUserExist?.email,
        role: isUserExist?.role
    }
    const accessToken = await generateToken(jwtPayload, envVars.jwt_access_secret, envVars.jwt_refresh_expires)

    return accessToken

}
