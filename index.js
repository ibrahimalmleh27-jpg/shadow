import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const app = express()

if (!fs.existsSync('files')) fs.mkdirSync('files')

// اسم عشوائي
const random = (ext) => crypto.randomBytes(6).toString('hex') + ext

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'files/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, random(ext))
  }
})

const upload = multer({ storage })

// 🔥 رفع
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.json({ status: false })

  const url = `${req.protocol}://${req.get('host')}/${req.file.filename}`

  res.json({
    status: true,
    url
  })
})

// 📂 عرض
app.get('/api/files', (req, res) => {
  const files = fs.readdirSync('./files')
  res.json({ status: true, files })
})

// 🗑️ حذف
app.get('/api/delete', (req, res) => {
  const file = req.query.file
  if (!file) return res.json({ status: false })

  const filePath = './files/' + file

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return res.json({ status: true })
  }

  res.json({ status: false })
})

app.use(express.static('files'))
app.use(express.static('public'))

app.listen(3000, () => console.log("🔥 Server Running"))