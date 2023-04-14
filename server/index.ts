import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// createPool() - unlike createConnection() - creates and releases connections on the go and automatically.
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: parseInt(process.env.PORT as string, 10),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

app.get("/", (req, res) => {
  res.send("API Endpoint for getting database entries (crags): .../api/crags/get");
});

app.get("/api/crags/get", (req, res) => {
  const sqlSelect = "SELECT * FROM crags";
  pool.query(sqlSelect, (error, result) => {
    error && console.log(error);
    res.json(result);
  });
});

app.post("/api/crags/post", (req, res) => {
  const { name, latitude, longitude, description, img_url } = req.body;
  console.log(img_url);
  const sqlInsert = "INSERT INTO crags (name, latitude, longitude, description, img_url) VALUES (?, ?, ?, ?, ?)";
  pool.query(sqlInsert, [name, latitude, longitude, description, img_url], (err, result) => {
    err && console.log(err);
    !err && res.json("Submitted successfully");
  });
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
