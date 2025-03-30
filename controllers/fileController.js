const axios = require("axios");
require("dotenv").config();
const File = require("../models/File");
const pdfParse = require("pdf-parse");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("⚠️ Missing GEMINI API Key. Please set it in .env file.");

// Export generateSummary function
exports.generateSummary = async function(text) {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
            contents: [{ parts: [{ text: `Summarize this document: ${text}` }] }]
        });

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate summary";
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Failed to generate summary";
    }
};

// Upload File to MongoDB
exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const filename = req.body.name;

        if (!file || !filename) {
            return res.status(400).json({ error: "File is required" });
        }

        // Extract text from PDF
        const data = await pdfParse(file.buffer);
        const text = data.text;

        // Generate summary
        const summary = await exports.generateSummary(text);

        const newFile = new File({
            name: filename,
            data: file.buffer,
            contentType: file.mimetype,
            summary: summary
        });

        await newFile.save();
        res.status(201).json({ 
            message: "File uploaded successfully", 
            fileId: newFile._id,
            summary: summary
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
};

// Get all files
exports.getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.json({ files });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Failed to fetch files" });
    }
};
