import httpStatus from 'http-status-codes';
import AppError from "../../error/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from 'jsonwebtoken';
import makeHashPassword from '../../utils/makeHashPassword';


/*  
 * Create a new user:
 * - Check if user already exists  
 * - Hash password  
 * - Save user in database  
 */
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist!!")
    }

    const authProvider: IAuthProvider = {
        provider: "Credential",
        providerId: email as string
    }

    const hashPassword = await makeHashPassword(password as string)

    const user = await User.create({
        email,
        password: hashPassword,
        auths: [authProvider],
        ...rest
    })
    return user
}


/*
 * Get all users:
 * - Fetch all users  
 * - Return list + total count  
 */
const getAllUsers = async () => {
    const users = await User.find({})
    const totalUser = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}


/*
 * Update user:
 * - Validate user existence  
 * - Role authorization check  
 * - Hash password if updated  
 * - Update and return user  
 */

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const targetUser = await User.findById(userId);
    if (!targetUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const requesterRole = decodedToken.role;
    const targetRole = targetUser.role;

    // 1. Role of a SUPER_ADMIN cannot be changed by anyone
    if (targetRole === Role.SUPER_ADMIN && payload.role) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot change the role of a super admin");
    }

    // 2. USER or GUIDE cannot update ANY role
    if (payload.role) {
        if (requesterRole === Role.USER || requesterRole === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to change roles");
        }

        // 3. ADMIN cannot assign SUPER_ADMIN role
        if (requesterRole === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "Admin cannot assign super admin role");
        }

        // 4. ADMIN cannot change role of another ADMIN
        if (requesterRole === Role.ADMIN && targetRole === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "Admin cannot change role of another admin");
        }
    }

    if (payload.isActive || payload.isVerified || payload.isDeleted) {
        if (requesterRole === Role.USER || requesterRole === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    
    if (payload.password) {
        payload.password = await makeHashPassword(payload.password);
    }


    const updatedUser = await User.findByIdAndUpdate(
        userId,
        payload,
        { new: true, runValidators: true }
    );

    return updatedUser;
};

export const userService = {
    createUser,
    getAllUsers,
    updateUser
}
