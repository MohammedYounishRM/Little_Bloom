import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoute.js";
import dashBoardRouter from "./routes/dashBoardRoute.js";
import childRoutes from "./routes/childRoute.js";
import attendanceRouter from "./routes/attendanceRoute.js";
import growthRouter from "./routes/growthRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({origin: process.env.FE_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", dashBoardRouter);
app.use("/api/children", childRoutes);
app.use("/api/attendance", attendanceRouter);
app.use("/api/growth", growthRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"/frontend/dist")));
    app.use((req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
    });
}

app.listen(port, () => {
    connectDB();
    console.log(`App Is Running On Port ${port}`);
});