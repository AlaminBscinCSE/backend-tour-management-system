/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import catchAsync from "../../catchAsync";
import sendResponse from "../../sendResponse";




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


export const userController = {
    createUser,
    getAllUsers,
}