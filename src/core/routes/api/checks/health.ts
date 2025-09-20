import { Request, Response } from "express";

export const healthHandler = (req: Request, res: Response) => {
    res.status(200).send("App is up and running...")
}

export default healthHandler