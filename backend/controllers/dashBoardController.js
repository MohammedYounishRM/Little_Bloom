import { pool } from "../db/connectDB.js";

export const getDashboard = async (req, res) => {
    try {
        const teacherId = req.userId;
        const todayDate = new Date().toISOString().split("T")[0];

        const countQuery = `SELECT COUNT(*) as total_strength FROM children WHERE teacher_id = $1`;
        const countResult = await pool.query(countQuery, [teacherId]);
        const totalStrength = parseInt(countResult.rows[0]?.total_strength || 0, 10);
 
        const attendanceQuery = `SELECT present_count, absent_count FROM attendance WHERE teacher_id = $1 AND attendance_date = $2`;
        const attendanceResult = await pool.query(attendanceQuery, [teacherId, todayDate]);

        let presentCount = 0;
        let absentCount = 0;

        if (attendanceResult.rows.length > 0) {
            presentCount = parseInt(attendanceResult.rows[0].present_count || 0, 10);
            absentCount = parseInt(attendanceResult.rows[0].absent_count || 0, 10);
        }

        const listQuery = `SELECT id, name FROM children WHERE teacher_id = $1 ORDER BY created_at DESC`;
        const listResult = await pool.query(listQuery, [teacherId]);

        res.status(200).json({
            success: true,
            metrics: { totalStrength, presentCount, absentCount },
            recentChildren: listResult.rows || []
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ success: false, message: "Server error compiling dashboard metrics." });
    }
};