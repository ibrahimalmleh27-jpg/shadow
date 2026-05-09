import express from "express"
import multer from "multer"
import cors from "cors"
import path from "path"

const app = express()
app.use(cors())

// 📂 رفع الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

// 📸 رفع صور → API
app.post("/api/images", upload.array("images", 100), (req, res) => {
  const files = req.files.map(f => ({
    url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
  }))

  res.json({
    status: true,
    total: files.length,
    results: files
  })
})

// 📂 رفع ملفات → روابط
app.post("/api/files", upload.array("files", 50), (req, res) => {
  const files = req.files.map(f => ({
    url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
  }))

  res.json({
    status: true,
    results: files
  })
})

// 📡 عرض الملفات
app.use("/uploads", express.static("uploads"))

// 🌐 الموقع
app.use(express.static("public"))

// 🔥 حل مشكلة "لا يمكن الحصول على /"
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html")
})

// 🔥 مهم لـ Railway
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("🚀 Server running")
})
