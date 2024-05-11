const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect(
  "mongodb+srv://ranjith:ranjith@cluster0.4fqhbov.mongodb.net/QrGenerator?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Create a schema for your QR code data
const qrCodeSchema = new mongoose.Schema({
  data: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model using the schema
const QRCode = mongoose.model("QRCode", qrCodeSchema);

// Route to handle storing QR code data
app.post("/api/qrcodes", async (req, res) => {
  try {
    const { data } = req.body;

    // Create a new QR code document
    const qrCode = new QRCode({ data });

    // Save the document to the database
    await qrCode.save();

    res
      .status(201)
      .json({ message: "QR Code data stored successfully", qrCode });
  } catch (error) {
    console.error("Error storing QR code data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
