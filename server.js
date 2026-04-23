const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 📦 إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 🚀 API رفع مفتوح
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    success: true,
    url: `/uploads/${req.file.filename}`
  });
});

// 📂 عرض الملفات مباشرة
app.use("/uploads", express.static("uploads"));

// 🌑 تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`shadow-garden running 🔥 http://localhost:${PORT}`);
});