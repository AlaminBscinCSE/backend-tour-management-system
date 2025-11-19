import express, { Request, Response } from "express"
import globalErrorHandler from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import { mainRoutes } from "./app/mainRouter"
import cors from "cors"


const app = express()


// Without this, req.body will always be undefined
app.use(express.json())

// Enable CORS so the frontend can communicate with this backend
app.use(cors())


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
