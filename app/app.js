const express = require("express");
const fs = require("fs");
const multer = require("multer");
const { createWorker } = require("tesseract.js");

const app = express();
const worker = createWorker({
  logger: m => console.log(m)
});

// Initialise storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).single("image");

// Initialise ejs template
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/uploads", (req, res) => {
  console.log("uploding...");
});

// Handle uploading of image and character recognition
app.post("/uploads", (req, res) => {
  upload(req, res, err => {
    console.log(req.file);

    // Use tesseract.js to recognise the characters in the image
    // and create a PDF version of the image with selctable text
    (async () => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text }
      } = await worker.recognize(`./uploads/${req.file.originalname}`);
      console.log(text);
      const { data } = await worker.getPDF("Tesseract OCR Result");
      fs.writeFileSync(
        "./downloads/tesseract-ocr-result.pdf",
        Buffer.from(data)
      );
      console.log("Generate PDF: tesseract-ocr-result.pdf");
      res.redirect("/downloads");
      await worker.terminate();
    })();
  });
});

// Download PDF of image with selectable text
app.get("/downloads", (req, res) => {
  const file = "downloads/tesseract-ocr-result.pdf";
  res.download(file);
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log("Listening on Port: 3000"));
