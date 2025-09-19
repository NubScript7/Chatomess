import { Router } from "express";
import { screenshotHandler } from "./screenshot";
import { pageScreenViewer } from "./pageScreen";

export const DebugRouter = Router()

DebugRouter.get("/screenshot", screenshotHandler)
DebugRouter.get("/page_screen", pageScreenViewer)