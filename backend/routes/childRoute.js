import express from "express";
import { getChildren, addChild, updateChild, deleteChild } from "../controllers/childContoller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const childRouter = express.Router();

childRouter.use(verifyToken);
childRouter.get("/", getChildren);
childRouter.post("/", addChild);
childRouter.put("/:id", updateChild);
childRouter.delete("/:id", deleteChild);

export default childRouter;