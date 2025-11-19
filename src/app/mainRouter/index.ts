import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";



const router = Router()

const moduleRotes = [
    {
        path: "/user",
        router: userRoutes
    },

]

moduleRotes.forEach((element) => {
    router.use(element.path, element.router)
})

export const mainRoutes = router