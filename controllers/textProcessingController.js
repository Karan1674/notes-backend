const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { generateSummary, extractKeyPoints } = require("../services/textProcessingService");

exports.processFile = async (req, res) => {
    try {
        console.log("✅ File upload request received");

        if (!req.file) {
            console.error("❌ No file uploaded");
            return res.status(400).json({ error: "No file uploaded" });
        }

        let extractedText = "";

        // **Extract text from PDF**
        if (req.file.mimetype === "application/pdf") {
            console.log("📄 Processing PDF file...");
            const data = await pdfParse(req.file.buffer);
            extractedText = data.text;
        } 
        // **Extract text from DOCX**
        else if (
            req.file.mimetype === "application/msword" ||
            req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            console.log("📄 Processing DOCX file...");
            const data = await mammoth.extractRawText({ buffer: req.file.buffer });
            extractedText = data.value;
        } else {
            console.error("❌ Unsupported file format");
            return res.status(400).json({ error: "Unsupported file format" });
        }

        if (!extractedText.trim()) {
            console.error("❌ Extracted text is empty");
            return res.status(400).json({ error: "No readable text found in the document" });
        }

        console.log("✅ Text extraction successful");

        console.log("⏳ Generating summary...");
        const summary = await generateSummary(extractedText);

        console.log("⏳ Extracting key points...");
        const keyPoints = await extractKeyPoints(extractedText);

        console.log("✅ Summary & key points generated successfully");

        res.json({ summary, keyPoints });
    } catch (error) {
        console.error("❌ Error processing file:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
