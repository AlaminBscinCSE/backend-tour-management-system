/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";




const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body)

    sendResponse(res, {
        StatusCode: httpStatus.CREATED,
        success: true,
        message: "user create successfully!",
        data: user,
    })

})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers()

    sendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "Get all users successfully!",
        data: result.data,
        meta: result.meta
    })
})


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id

    const decodedToken = req.user

    const user = await userService.updateUser(userId, req.body, decodedToken as JwtPayload)

    sendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "user update successfully!",
        data: user,
    })

})
export const userController = {
    createUser,
    getAllUsers,
    updateUser
}