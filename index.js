import express from 'express'
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

const app = express()

// إنشاء فولدر
if (!fs.existsSync('files')) fs.mkdirSync('files')

// اسم عشوائي
const random = (ext) => crypto.randomBytes(5).toString('hex') + ext

// إعداد الرفع
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'files/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin'
    cb(null, random(ext))
  }
})

const upload = multer({ storage })

// 🚀 API رفع
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.json({ status: false })

  const url = `${req.protocol}://${req.get('host')}/${req.file.filename}`

  res.json({
    status: true,
    url
  })
})

// عرض الملفات
app.use(express.static('files'))

// الواجهة
app.use(express.static('public'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("🔥 Shadow Catbox Running"))