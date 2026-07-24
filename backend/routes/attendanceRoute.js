import express from "express";
import { saveDailyAttendance, getTodayAttendanceStatus, getAttendanceHistory } from "../controllers/attendanceController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const attendanceRouter = express.Router();

attendanceRouter.use(verifyToken);
attendanceRouter.post("/save-daily", saveDailyAttendance);
attendanceRouter.get("/today-status", getTodayAttendanceStatus);
attendanceRouter.get("/history", getAttendanceHistory);

export default attendanceRouter;