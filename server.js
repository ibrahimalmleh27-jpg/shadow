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

// 📸 API الصور
app.post("/api/images", upload.array("images", 100), (req, res) => {
  const files = req.files.map(f => ({
    url: `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
  }))

  res.json({
    status: true,
    results: files
  })
})

// 📂 API الملفات
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

// 🔥 أهم جزء (حل المشكلة)
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"))
})

// 🔥 بورت Railway
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running")
})
