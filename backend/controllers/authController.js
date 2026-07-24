import { pool } from "../db/connectDB.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetSuccessEmail, sendPasswordResetEmail, sendVerificationEmail } from "../nodemailer/emails.js";
import { formatUserResponse } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
    const { name, email, password, phone, center_name, center_id } = req.body;
    try {
        if (!name || !email || !password || !phone || !center_name || !center_id) {
            throw new Error("All Fields Are Mandatory!");
        }

        const existingUserCheck = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);
        if (existingUserCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        
        const insertQuery = `INSERT INTO teachers (name, email, password, phone, center_name, center_id, "verificationToken", "verificationTokenExpiresAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, "isVerified"`;
        const newUser = await pool.query(insertQuery, [name, email, hashedPassword, phone, center_name, center_id, verificationToken, new Date(Date.now() + 24 * 60 * 60 * 1000)]);
        const user = newUser.rows[0];

        generateTokenAndSetCookie(res, user.id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: formatUserResponse(user),
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const queryStr = `SELECT * FROM teachers WHERE "verificationToken" = $1 AND "verificationTokenExpiresAt" > NOW()`;
        const userResult = await pool.query(queryStr, [code]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid code / Expired verification token!" });
        }

        const user = userResult.rows[0];
        const updateQuery = `UPDATE teachers SET "isVerified" = true, "verificationToken" = NULL, "verificationTokenExpiresAt" = NULL WHERE id = $1 RETURNING *`;
        const updatedUserResult = await pool.query(updateQuery, [user.id]);
        const updatedUser = updatedUserResult.rows[0];

        res.status(200).json({ success: true, message: "Email Verified Successfully!", user: formatUserResponse(updatedUser) });
    } catch (error) {
        console.log("Error in verifying Email", error);
        res.status(500).json({ success: false, message: "Error in verifying email! Server error!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }

        const user = userResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password!" });
        }

        generateTokenAndSetCookie(res, user.id);
        
        const loginUpdate = await pool.query('UPDATE teachers SET "lastLogin" = NOW() WHERE id = $1 RETURNING *', [user.id]);

        res.status(200).json({ success: true, message: "Logged In Successfully", user: formatUserResponse(loginUpdate.rows[0]) });
    } catch (error) {
        console.log("Error in login controller phase", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const userResult = await pool.query("SELECT * FROM teachers WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "User not Found!" });
        }

        const user = userResult.rows[0];
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetPasswordExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        await pool.query('UPDATE teachers SET "resetPasswordToken" = $1, "resetPasswordExpiresAt" = $2 WHERE id = $3', [resetToken, resetPasswordExpiresAt, user.id]);

        await sendPasswordResetEmail(user.email, resetToken);
        res.status(200).json({ success: true, message: "Password Reset OTP Code Dispatched Successfully" });
    } catch (error) {
        console.log("Error in forgot password phase!", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyResetOTP = async (req, res) => {
    try {
        const { code } = req.body;
        const queryStr = `SELECT * FROM teachers WHERE "resetPasswordToken" = $1 AND "resetPasswordExpiresAt" > NOW()`;
        const userResult = await pool.query(queryStr, [code]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid or expired Reset Code!" });
        }

        res.status(200).json({ success: true, message: "Reset OTP Verified Successfully" });
    } catch (error) {
        console.log("Error inside validation OTP code check", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { code, password } = req.body;
        const queryStr = `SELECT * FROM teachers WHERE "resetPasswordToken" = $1 AND "resetPasswordExpiresAt" > NOW()`;
        const userResult = await pool.query(queryStr, [code]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "User not Found!" });
        }

        const user = userResult.rows[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        const updateStr = `UPDATE teachers SET password = $1, "resetPasswordToken" = NULL, "resetPasswordExpiresAt" = NULL WHERE id = $2`;
        await pool.query(updateStr, [hashedPassword, user.id]);
        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password Updated Successfully" });
    } catch (error) {
        console.log("Error in reset password!", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const userResult = await pool.query("SELECT id, name, email, phone, center_name, center_id, \"lastLogin\", \"isVerified\", \"createdAt\", \"updatedAt\" FROM teachers WHERE id = $1", [req.userId]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: "User Mail not found!" });
        }
        res.status(200).json({ success: true, user: userResult.rows[0] });
    } catch (error) {
        console.log("Error inside identity control mapping logic", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const { name, phone, center_name, center_id } = req.body;
    try {
        if (!name || !phone || !center_name || !center_id) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const updateQuery = ` UPDATE teachers SET name = $1, phone = $2, center_name = $3, center_id = $4, "updatedAt" = NOW() 
            WHERE id = $5 RETURNING id, name, email, phone, center_name, center_id, "lastLogin", "isVerified", "createdAt", "updatedAt" `;
        
        const result = await pool.query(updateQuery, [name, phone, center_name, center_id, req.userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully!", user: result.rows[0] });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Server error during profile update." });
    }
};