// const multer = require("multer");
// const path = require("path");

// // Set storage location
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); // Save files in 'uploads/' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// // File filter to allow only PDFs
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "application/pdf") {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PDF files are allowed"), false);
//     }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;



const multer = require("multer");

// Configure Multer to store files in memory
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB
});

module.exports = upload;
