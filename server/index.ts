import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { convertAndUploadToStorage } from "./helperFunctions";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer();

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

app.post("/api/crags/post", upload.single("file"), async (req, res) => {
  const { name, latitude, longitude, description } = req.body;
  const file = req.file;

  const sqlInsert = "INSERT INTO crags (name, latitude, longitude, description) VALUES (?, ?, ?, ?)";
  pool.query(sqlInsert, [name, latitude, longitude, description], (err, result) => {
    if (err) {
      console.log(err);
      // error
    } else {
      res.send("success");
    }
  });

  if (file) {
    const fileUrls = await convertAndUploadToStorage(file);
    const sqlUpdate = "UPDATE crags SET img_url = ?, img_url_small = ? WHERE name = ?";
    pool.query(sqlUpdate, [fileUrls.imgUrl, fileUrls.resizedImgUrl, name], (err, result) => {
      if (err) {
        console.log(err);
        // error
      } else {
        // ...
      }
    });
  }
});

app.put("/api/crags/update-image", upload.single("file"), async (req, res) => {
  const { name } = req.body;
  const file = req.file!;
  const fileUrls = await convertAndUploadToStorage(file);
  const sqlUpdate = "UPDATE crags SET img_url = ?, img_url_small = ? WHERE name = ?";
  pool.query(sqlUpdate, [fileUrls.imgUrl, fileUrls.resizedImgUrl, name], (err, result) => {
    if (err) {
      console.log(err);
      // error
    } else {
      res.send("Success");
      // ...
    }
  });
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
