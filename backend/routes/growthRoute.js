import express from "express";
import { saveGrowthRecord } from "../controllers/growthController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const growthRouter = express.Router();

growthRouter.use(verifyToken);
growthRouter.post("/save", saveGrowthRecord);

export default growthRouter;