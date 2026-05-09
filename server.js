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

// 📸 API صور
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

// 📂 API ملفات
app.post("/api/files", upload.array("files", 50), (req, res) => {
  const files = req.files.map(f => ({
    url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
  }))

  res.json({
    status: true,
    results: files
  })
})

// عرض الملفات
app.use("/uploads", express.static("uploads"))

// الموقع
app.use(express.static("public"))

app.listen(3000, () => {
  console.log("🔥 Server running on http://localhost:3000")
})
