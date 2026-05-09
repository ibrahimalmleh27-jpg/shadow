import express from "express"
import multer from "multer"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())
app.use(express.json())

// 📂 تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

// 📸 رفع صور → API
app.post("/upload-images", upload.array("images", 100), (req, res) => {

  let files = req.files.map(f => ({
    name: f.filename,
    url: `http://localhost:3000/uploads/${f.filename}`
  }))

  res.json({
    status: true,
    creator: "Shadow",
    total: files.length,
    results: files
  })

})

// 📂 رفع ملفات → روابط
app.post("/upload-files", upload.array("files", 50), (req, res) => {

  let files = req.files.map(f => ({
    name: f.filename,
    url: `http://localhost:3000/uploads/${f.filename}`
  }))

  res.json({
    status: true,
    results: files
  })

})

// 📡 عرض الملفات
app.use("/uploads", express.static("uploads"))

// تشغيل
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000")
})
