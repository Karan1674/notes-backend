const axios = require("axios");
require("dotenv").config();
const File = require("../models/File");
const pdfParse = require("pdf-parse");

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("⚠️ Missing GEMINI API Key. Please set it in .env file.");

async function getFileContent(fileId) {
    try {
        const file = await File.findById(fileId);
        if (!file) {
            return null;
        }

        // Extract text from PDF
        const data = await pdfParse(file.data);
        return data.text;
    } catch (error) {
        console.error("Error getting file content:", error);
        return null;
    }
}

exports.answerQuestion = async (req, res) => {
    try {
        const { question, fileId } = req.body;
        if (!question || !fileId) {
            return res.status(400).json({ error: "Question and fileId are required" });
        }

        const fileContent = await getFileContent(fileId);
        if (!fileContent) {
            return res.status(404).json({ error: "File not found or failed to extract content" });
        }

        const prompt = `
        You are a helpful assistant analyzing a document. 
        The document content is as follows:
        ${fileContent}

        User's question: ${question}
        Please provide a clear and concise answer based on the document content.
        If the question cannot be answered from the document, please say so.
        `;

        const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate answer";
        
        res.json({ answer });
    } catch (error) {
        console.error("❌ Error answering question:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to process question" });
    }
};