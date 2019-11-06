const express = require("express");
const fs = require("fs");
const multer = require("multer");
const { createWorker } = require("tesseract.js");

const app = express();
const worker = createWorker({
  logger: m => console.log(m)
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).single("image");

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/uploads", (req, res) => {
  console.log("uploding...");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    console.log(req.file);
  });
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log("Listening on Port: 3000"));
