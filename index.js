const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/uploadRoutes");
const textProcessingRoutes = require("./routes/textProcessingRoutes");
const pdfRoutes = require("./routes/pdfRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", uploadRoutes);
app.use("/api/text", textProcessingRoutes);
app.use("/api", pdfRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in .env file");
    }
    
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
