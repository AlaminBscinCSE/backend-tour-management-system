import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";
import { authRoutes } from "../modules/auth/auth.router";



const router = Router()

const moduleRotes = [
    {
        path: "/user",
        router: userRoutes
    },
    {
        path: "/auth",
        router: authRoutes
    },
]

moduleRotes.forEach((element) => {
    router.use(element.path, element.router)
})

export const mainRoutes = router