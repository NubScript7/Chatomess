import { Router } from "express";
import { screenshotHandler } from "./screenshot";
import { pageScreenHandler } from "./pageScreen";

export const DebugRouter = Router()

DebugRouter.get("/screenshot", screenshotHandler)
DebugRouter.get("/page_screen", pageScreenHandler)

export default DebugRouter