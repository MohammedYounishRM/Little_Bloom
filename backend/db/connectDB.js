import { Pool } from 'pg';
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized : false } : false
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL Relational DB Connected Successfully via pg Client Pool!");
        client.release();
    } catch (error) {
        console.error("Error establishing connection mapping to PostgreSQL:", error.message);
        process.exit(1);
    }
};

export { pool };
export default connectDB;