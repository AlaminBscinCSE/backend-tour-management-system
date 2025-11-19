import { Response } from "express";

interface IMeta {
    total: number
}

interface IResponse<T> {
    StatusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: IMeta
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
    res.status(data.StatusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,

    })
}


export default sendResponse