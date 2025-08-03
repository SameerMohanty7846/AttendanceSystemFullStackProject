import mysql from 'mysql2';

const db =  mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Change to your MySQL username
  password: 'root',      // Change to your MySQL password
  database: 'attendance_db'
});

console.log('Connected to MySQL database');
export default db;