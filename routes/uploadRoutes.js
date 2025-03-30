const express = require("express");
const multer = require("multer");
const { uploadFile, getFiles, generateSummary } = require("../controllers/fileController");
const File = require("../models/File");
const pdfParse = require("pdf-parse");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set appropriate headers for PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
    
    // Send the file data as a binary stream
    res.send(file.data);

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
});

// Get file summary
router.get("/:id/summary", async (req, res) => {
  try {
    const id = req.params.id;
    const file = await File.findById(id);
    
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!file.summary) {
      // If summary doesn't exist, extract text and generate it
      const data = await pdfParse(file.data);
      const text = data.text;
      const summary = await generateSummary(text);
      
      // Update file with summary
      file.summary = summary;
      await file.save();
    }

    res.json({ summary: file.summary });
  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({ error: "Failed to retrieve summary" });
  }
});

module.exports = router;
