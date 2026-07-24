import { pool } from "../db/connectDB.js";

export const saveDailyAttendance = async (req, res) => {
    const { date, records } = req.body;
    const teacherId = req.userId;

    if (!date || !records) {
        return res.status(400).json({ success: false, message: "Missing required parameters." });
    }

    try {
        const totalStrength = records.length;
        const presentCount = records.filter(r => r.status === "Present").length;
        const absentCount = totalStrength - presentCount;

        const upsertSummaryQuery = `INSERT INTO attendance (teacher_id, attendance_date, total_strength, present_count, absent_count, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (teacher_id, attendance_date) DO UPDATE SET total_strength = EXCLUDED.total_strength,
            present_count = EXCLUDED.present_count, absent_count = EXCLUDED.absent_count, updated_at = NOW(); `;
        await pool.query(upsertSummaryQuery, [teacherId, date, totalStrength, presentCount, absentCount]);

        for (const record of records) {
            const upsertLogQuery = `INSERT INTO attendance_logs (attendance_date, child_id, status, teacher_id, updated_at) VALUES ($1, $2, $3, $4, NOW())
                ON CONFLICT (attendance_date, child_id) DO UPDATE SET status = EXCLUDED.status, updated_at = NOW(); `;
            await pool.query(upsertLogQuery, [date, record.childId, record.status, teacherId]);
        }

        res.status(200).json({ success: true, message: "Attendance saved!" });
    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getTodayAttendanceStatus = async (req, res) => {
    const { date } = req.query;
    const teacherId = req.userId;

    try {
        const query = `SELECT child_id, status FROM attendance_logs WHERE teacher_id = $1 AND attendance_date = $2`;
        const result = await pool.query(query, [teacherId, date]);

        if (result.rows.length === 0) {
            return res.status(200).json({ success: true, savedBefore: false });
        }

        res.status(200).json({ success: true, savedBefore: true, records: result.rows.map(r => ({ childId: r.child_id, status: r.status }))
    });
    } catch (error) {
        console.error("Fetch status error:", error);
        res.status(500).json({ success: false, message: "Failed to read the logs." });
    }
};

export const getAttendanceHistory = async (req, res) => {
    const teacherId = req.userId;

    try {
        const query = `SELECT TO_CHAR(attendance_date, 'YYYY-MM-DD') as date, present_count, absent_count FROM attendance WHERE teacher_id = $1 ORDER BY attendance_date DESC`;
        const result = await pool.query(query, [teacherId]);

        res.status(200).json({ success: true, history: result.rows });
    } catch (error) {
        console.error("Error in fetching attendance history:", error);
        res.status(500).json({ success: false, message: "Server error while fetching history logs." });
    }
};