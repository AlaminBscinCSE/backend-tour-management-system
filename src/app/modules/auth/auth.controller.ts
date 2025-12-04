/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { authService } from './auth.service';
import AppError from '../../error/AppError';
import { setAuthCookies } from '../../utils/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import { createUserTokens } from '../../utils/userToken';
import { envVars } from '../../config/env';
import passport from 'passport';




/* 
 * Handle user login using email/password.
 * Validates credentials, generates tokens, and sets cookies.
*/
const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(401, err))
        }

        if (!user) {
            return next(new AppError(401, info.message))
        }
        const userTokens = await createUserTokens(user)

        await setAuthCookies(res, userTokens)


        delete user.toObject().password
        sendResponse(res, {
            StatusCode: httpStatus.CREATED,
            success: true,
            message: "user Logged In successfully!",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user
            },
        })
    })(req, res, next)

})


/* 
 * Issue a new access token using refresh token from cookies.
 * Throws error if refresh token is missing or invalid.
*/
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token received form cookies")
    }
    const tokenInfo = await authService.getNewAccessToken(refreshToken)

    await setAuthCookies(res, tokenInfo)
    sendResponse(res, {
        StatusCode: httpStatus.CREATED,
        success: true,
        message: "Get new access token successfully!",
        data: tokenInfo,
    })
})


/* 
 * Log out user by clearing both access & refresh cookies.
*/
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    sendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: " User Logout successfully!",
        data: null,
    })
})


/* 
 * Reset user password by verifying old password
 * and updating with a new one.
*/
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.newPassword
    const decoded = req.user
    await authService.resetPassword(oldPassword, newPassword, decoded as JwtPayload)

    sendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: " Reset password successfully!",
        data: null,
    })
})


/* 
 * Handle Google OAuth callback.
 * Creates tokens for logged-in Google user,
 * sets cookies, then redirects to frontend.
*/
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : " "
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    const tokenInfo = await createUserTokens(user)

    await setAuthCookies(res, tokenInfo)

    res.redirect(`${envVars.Frontend_Url}/${redirectTo}`)

})


export const authController = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController,
}
