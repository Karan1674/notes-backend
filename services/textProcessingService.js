const axios = require("axios");
require("dotenv").config(); // Load environment variables

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("⚠️ Missing GEMINI API Key. Please set it in .env file.");

// **Function to generate summary**
exports.generateSummary = async (text) => {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
            contents: [{ parts: [{ text: `Summarize this: ${text}` }] }]
        });

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated";
    } catch (error) {
        console.error("❌ Error generating summary:", error.response?.data || error.message);
        return "Failed to generate summary";
    }
};

// **Function to extract key points**
exports.extractKeyPoints = async (text) => {
    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, {
            contents: [{ parts: [{ text: `Extract key points from this: ${text}` }] }]
        });

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No key points extracted";
    } catch (error) {
        console.error("❌ Error extracting key points:", error.response?.data || error.message);
        return "Failed to extract key points";
    }
};
