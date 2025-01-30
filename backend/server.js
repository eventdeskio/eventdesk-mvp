const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const { Pool } = require("pg");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

const FOLDER_ID = process.env.FOLDER_TO_SAVE;

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [FOLDER_ID], 
    };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id, webViewLink, webContentLink",
    });

    fs.unlinkSync(req.file.path); 

    res.json({
        fileId: file.data.id,
        driveLink: file.data.webViewLink, 
        directDownloadLink: file.data.webContentLink,
        message: "File uploaded successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/savedetails", async (req, res) => {
  const { name, email, mobileNo, linkedinurl, salaryExpecation, socials, role, description, resumeLink } = req.body;

  if (!name || !email || !resumeLink) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query =
      "INSERT INTO resumes (name, email, mobileNo, linkedinurl, salaryExpecation, socials, role, description, resumeLink, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const values = [name, email, mobileNo, linkedinurl, salaryExpecation, socials, role, description, resumeLink, new Date()];

    const result = await pool.query(query, values);

    res.json({
      message: "Form data saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(process.env.SERVER_PORT, () => console.log(`Server running on port ${process.env.SERVER_PORT}`));
