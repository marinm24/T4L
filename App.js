// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);

    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        console.log(res.data);
        // Refresh books list after upload
        axios.get('http://localhost:5000/books')
          .then(res => setBooks(res.data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Bookstore</h1>
      <input type="file" onChange={handleFileChange} />
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={handleUpload}>Upload Book</button>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>{book.description}</p>
            <a href={`http://localhost:5000/${book.pdfPath}`} target="_blank" rel="noopener noreferrer">Read PDF</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
