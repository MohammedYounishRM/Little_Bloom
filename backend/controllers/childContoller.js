import { pool } from "../db/connectDB.js";

export const getChildren = async (req, res) => {
    try {
        const query = `SELECT c.id, c.name, c.age, TO_CHAR(c.dob, 'YYYY-MM-DD') as dob, c.gender, c.parent_name, c.phone, c.address,
                (SELECT bmi FROM growth_records WHERE child_id = c.id ORDER BY created_at DESC LIMIT 1) as latest_bmi FROM children c WHERE c.teacher_id = $1 ORDER BY c.created_at DESC`;
        const result = await pool.query(query, [req.userId]);
        
        res.status(200).json({ success: true, children: result.rows });
    } catch (error) {
        console.error("Error in getChildren:", error);
        res.status(500).json({ success: false, message: "Server error while fetching children records." });
    }
};

export const addChild = async (req, res) => {
    const { name, age, dob, gender, parent_name, phone, address } = req.body;

    if (!name || !age || !dob || !gender || !parent_name || !phone || !address) {
        return res.status(400).json({ success: false, message: "All input fields are completely mandatory." });
    }

    try {
        const query = `INSERT INTO children (teacher_id, name, age, dob, gender, parent_name, phone, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                       RETURNING id, name, age, TO_CHAR(dob, 'YYYY-MM-DD') as dob, gender, parent_name, phone, address`;
        
        const result = await pool.query(query, [req.userId, name, parseInt(age), dob, gender, parent_name, phone, address]);
        res.status(201).json({ success: true, child: result.rows[0], message: "Child registered successfully!" });
    } catch (error) {
        console.error("Error in addChild:", error);
        res.status(500).json({ success: false, message: "Server error while compiling child creation." });
    }
};

export const updateChild = async (req, res) => {
    const { id } = req.params;
    const { name, age, dob, gender, parent_name, phone, address } = req.body;

    try {
        const checkQuery = `SELECT * FROM children WHERE id = $1 AND teacher_id = $2`;
        const checkResult = await pool.query(checkQuery, [id, req.userId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Child profile record not found or unauthorized access." });
        }

        const updateQuery = `UPDATE children SET name = $1, age = $2, dob = $3, gender = $4, parent_name = $5, phone = $6, address = $7, updated_at = NOW()
                            WHERE id = $8 AND teacher_id = $9 RETURNING id, name, age, TO_CHAR(dob, 'YYYY-MM-DD') as dob, gender, parent_name, phone, address`;
        
        const result = await pool.query(updateQuery, [name, parseInt(age), dob, gender, parent_name, phone, address, id, req.userId]);
        res.status(200).json({ success: true, child: result.rows[0], message: "Child profile updated successfully!" });
    } catch (error) {
        console.error("Error in updateChild:", error);
        res.status(500).json({ success: false, message: "Server error while saving modifications." });
    }
};

export const deleteChild = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteQuery = `DELETE FROM children WHERE id = $1 AND teacher_id = $2 RETURNING id`;
        const result = await pool.query(deleteQuery, [id, req.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Record not found or unauthorized access." });
        }

        res.status(200).json({ success: true, id: id, message: "Child profile permanently removed." });
    } catch (error) {
        console.error("Error in deleteChild:", error);
        res.status(500).json({ success: false, message: "Server error while executioning removal." });
    }
};