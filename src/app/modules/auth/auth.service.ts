import httpStatus from 'http-status-codes';
import AppError from "../../error/AppError"
import { User } from "../user/user.model"
import bcrypt from "bcryptjs"
import { createNewAccessTokenWithRefreshToken } from '../../utils/userToken';
import { JwtPayload } from 'jsonwebtoken';
import makeHashPassword from '../../utils/makeHashPassword';




const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}
const resetPassword = async (oldPassword: string, newPassword: string, decoded: JwtPayload) => {

    const user = await User.findById(decoded.userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user?.password as string,)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old password did not match")
    }

    user.password = (await makeHashPassword(newPassword)) as string;
    user.save()

}


export const authService = {
    getNewAccessToken,
    resetPassword,
}