import express from "express"
import healthHandler from "./health"

export const ChecksRouter = express.Router()

ChecksRouter.get("/health", healthHandler)

export default ChecksRouter