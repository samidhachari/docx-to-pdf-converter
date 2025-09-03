const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const libre = require("libreoffice-convert");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS + JSON
app.use(cors());
app.use(express.json());

// Serve static UI
app.use(express.static(path.join(__dirname, "public")));

// Upload storage setup
const upload = multer({ dest: "uploads/" });
app.get("/",(_req,res)=>{
  return "<h1>server is running</h1>"
})

// API: Health check
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// API: Convert DOCX → PDF
app.post("/api/convert", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const inputPath = req.file.path;
  const convertedDir = path.join(__dirname, "converted");

  // Ensure converted directory exists
  if (!fs.existsSync(convertedDir)) fs.mkdirSync(convertedDir);

  const outputPath = path.join(convertedDir, `${Date.now()}.pdf`);
  const fileBuffer = fs.readFileSync(inputPath);

  libre.convert(fileBuffer, ".pdf", undefined, (err, done) => {
    // Delete uploaded file safely
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

    if (err) {
      console.error("❌ Conversion failed: ", err);
      return res.status(500).send("Conversion failed.");
    }

    fs.writeFileSync(outputPath, done);

    // Send the file
    res.download(outputPath, "converted.pdf", (err) => {
      if (err) console.error("❌ Download error:", err);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath); // Safe delete
    });
  });
});


// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);



