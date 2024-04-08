// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

// Define Schema for Book
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  pdfPath: String,
  ratings: [Number],
  comments: [String],
});

const Book = mongoose.model('Book', bookSchema);

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.single('pdf'), (req, res) => {
  const { title, author, description } = req.body;
  const pdfPath = req.file.path;
  
  const newBook = new Book({ title, author, description, pdfPath });
  newBook.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading book');
    } else {
      res.status(200).send('Book uploaded successfully');
    }
  });
});

app.get('/books', (req, res) => {
  Book.find({}, (err, books) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching books');
    } else {
      res.json(books);
    }
  });
});

// Listen
app.listen(port, () => console.log(`Server running on port ${port}`));
