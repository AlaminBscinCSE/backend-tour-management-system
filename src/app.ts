import express, { Request, Response } from "express"
import globalErrorHandler from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import { mainRoutes } from "./app/mainRouter"
import cors from "cors"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"
import "./app/config/passport"


const app = express()


app.use(expressSession({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(cors())
app.use(cookieParser());


// Helps maintain organized and scalable API endpoints
app.use("/api/v1", mainRoutes)


// Basic root route for quick server health check
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to tour-management-system"
    })
})


//Global error handler 
app.use(globalErrorHandler)

//not found Route
app.use(notFound)

export default app
