import express from "express"
import multer from "multer"
import cors from "cors"
import fs from "fs"

const app = express()
app.use(cors())

// 📁 فولدرات
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))
app.use("/img", express.static("img")) // 👈 مهم عشان الصورة

// 📂 رفع ملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

const DB_FILE = "images.json"

// 📌 قراءة
function loadDB() {
  if (!fs.existsSync(DB_FILE)) return []
  return JSON.parse(fs.readFileSync(DB_FILE))
}

// 📌 حفظ
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

// 📤 رفع
app.post("/api/upload", upload.single("file"), (req, res) => {
  let db = loadDB()

  let url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`

  db.push(url)
  saveDB(db)

  res.json({
    status: true,
    creator: "S7ADOW",
    url
  })
})

// 📡 API
app.get("/api/gallery", (req, res) => {
  res.json(loadDB())
})

// 🌐 الصفحة
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html")
})

// 🚀 تشغيل
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("🔥 S7ADOW RUNNING"))
