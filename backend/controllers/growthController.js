import { pool } from "../db/connectDB.js";

export const saveGrowthRecord = async (req, res) => {
    const { childId, height, weight, bmi, date } = req.body;
    const teacherId = req.userId;

    if (!childId || !height || !weight || !bmi) {
        return res.status(400).json({ success: false, message: "All growth metrics are required." });
    }

    try {
        const childCheck = await pool.query("SELECT dob FROM children WHERE id = $1 AND teacher_id = $2", [childId, teacherId]);
        if (childCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Child record not found or unauthorized access." });
        }

        const insertQuery = `INSERT INTO growth_records (child_id, teacher_id, height, weight, bmi, recorded_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, recorded_date;`;

        const result = await pool.query(insertQuery, [ childId, teacherId, parseFloat(height), parseFloat(weight), parseFloat(bmi), date || new Date().toISOString().split("T")[0] ]);

        res.status(201).json({ success: true, message: "Growth details logged successfully!", record: result.rows[0] });
    } catch (error) {
        console.error("Error saving growth record:", error);
        res.status(500).json({ success: false, message: "Server error while saving growth record." });
    }
};