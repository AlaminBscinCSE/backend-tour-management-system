import bcrypt from "bcryptjs"
import { envVars } from "../config/env"




const makeHashPassword = async (password: string) => {
    return await bcrypt.hash(password as string, Number(envVars.bcrypt_salt_round))
}

export default makeHashPassword