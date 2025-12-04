import { Response } from "express"

export interface IAuthTokens {
    accessToken?: string
    refreshToken?: string
}

export const setAuthCookies = async (res: Response, tokenInfo: IAuthTokens) => {

    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
        })
    }
}