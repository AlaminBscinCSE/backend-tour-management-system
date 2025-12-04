import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import makeHashPassword from "./makeHashPassword"



const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await User.findOne({ email: envVars.super_admin_email })
        if (isSuperAdminExists) {
            console.log("Already super admin exists!")
            return
        }
        console.log("Trying create super admin!!")
        const hashPassword = await makeHashPassword(envVars.super_admin_password)
        const authProvider: IAuthProvider = {
            provider: "Credential",
            providerId: envVars.super_admin_email
        }
        const payload: IUser = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: envVars.super_admin_email,
            password: hashPassword,
            isVerified: true,
            auths: [authProvider]
        }
        const superAdmin = await User.create(payload)
        console.log("Super admin create successfully! \n")
        console.log(superAdmin)
    } catch (error) {
        console.log(error)
    }
}


export default seedSuperAdmin