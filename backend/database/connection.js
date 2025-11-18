import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


dotenv.config()

const db = await mysql.createPool(
    {
    host: process.env.DB_HOST,       // localhost
    user: process.env.DB_USER,       // root
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,   // passport_system
    waitForConnections: true,
    connectionLimit: 10
}

);


console.log('✅ MySQL pool connected');

export default db;

