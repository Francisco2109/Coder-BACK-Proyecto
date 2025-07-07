import { Router } from "express";

const viewRouter = Router();

viewRouter.get("/realtimeproducts", (req, res) => res.render("realTimeProducts"));

export default viewRouter;
