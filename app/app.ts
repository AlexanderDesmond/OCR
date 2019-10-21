import express from "express";
import fs from "fs";
import multer from "multer";
//import { Tesseract } from "tesseract.js";
import { Tesseract } from "tesseract.ts";

const app = express();
//const worker = new TesseractWorker();
const paths: { workerPath: string; langPath: string; corePath: string } = {
  workerPath: "",
  langPath: "",
  corePath: ""
};
const worker = Tesseract.create(paths);
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, res, cb) => {
    cb(null, req.file.toString());
  }
});

const upload = multer({ storage: storage }).single("image");

app.set("view engine", "ejs");
app.get("/uploads", (req, res) => {
  console.log("uploading...");
});
