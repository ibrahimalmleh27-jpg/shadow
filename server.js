import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// إنشاء فولدر
if (!fs.existsSync('files')) {
  fs.mkdirSync('files')
}

// اسم عشوائي
function randomName(ext) {
  return crypto.randomBytes(8).toString('hex') + ext
}

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'files/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, randomName(ext))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
})

// ✅ رفع
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.json({ status: false })

  const url = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`

  res.json({
    status: true,
    url
  })
})

// ✅ عرض كل الملفات
app.get('/files-list', (req, res) => {
  const files = fs.readdirSync('files')
  res.json(files)
})

// ✅ حذف ملف
app.delete('/delete/:name', (req, res) => {
  const file = `files/${req.params.name}`

  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    return res.json({ status: true })
  }

  res.json({ status: false })
})

// عرض الملفات
app.use('/files', express.static('files'))

// الصفحة
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})

// تشغيل
app.listen(process.env.PORT || 3000, () => {
  console.log('🔥 Shadow Host شغال')
})