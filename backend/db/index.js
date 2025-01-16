import mysql from "mysql2";
import ApiError from "../utils/ApiError.js";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Chinmay@1824",
    database: "commonDB1",
});

connection.connect((err) => {
    if (err) {
        console.log(new ApiError(500, "Database connection failed."));
        process.exit(1);
    } else {
        console.log("Connected to database as ID: " + connection.threadId)
    }
});

export { connection };