const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("images")) fs.mkdirSync("images");

// تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") cb(null, "images/");
    else cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// قاعدة بيانات بسيطة
let filesDB = {};

// 🔐 رفع ملف + باسورد + صورة
app.post("/upload", upload.fields([
  { name: "file", maxCount: 1 },
  { name: "image", maxCount: 1 }
]), (req, res) => {

  const file = req.files["file"][0];
  const image = req.files["image"] ? req.files["image"][0] : null;
  const password = req.body.password;

  const id = uuidv4();

  filesDB[id] = {
    filename: file.filename,
    password: password,
    image: image ? image.filename : null
  };

  res.json({
    message: "تم الرفع",
    link: `http://your-domain/file/${id}`
  });
});

// 🔑 عرض صفحة الملف
app.get("/file/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public/view.html"));
});

// 🔐 التحقق من الباسورد
app.post("/check/:id", (req, res) => {
  const file = filesDB[req.params.id];

  if (!file) return res.status(404).send("Not found");

  if (file.password !== req.body.password) {
    return res.status(403).json({ error: "باسورد غلط" });
  }

  res.json({
    download: `/download/${req.params.id}`,
    image: file.image ? `/images/${file.image}` : null
  });
});

// 📥 تحميل مباشر
app.get("/download/:id", (req, res) => {
  const file = filesDB[req.params.id];
  if (!file) return res.sendStatus(404);

  res.download(path.join(__dirname, "uploads", file.filename));
});

// static
app.use("/images", express.static("images"));

app.listen(3000, () => {
  console.log("API شغال 🔥");
});