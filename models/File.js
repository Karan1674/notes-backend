const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    data: { type: Buffer, required: true }, // Store the file as binary data
    contentType: { type: String, required: true }, // Store MIME type (PDF)
    summary: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
