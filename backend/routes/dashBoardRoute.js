import express from "express";
import { getDashboard } from "../controllers/dashBoardController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const dashBoardRouter = express.Router();
dashBoardRouter.get("/dashboard", verifyToken, getDashboard);

export default dashBoardRouter;