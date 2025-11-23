import React, { useState, useEffect } from 'react'
import axios from 'axios'
import '../css/pagesCSS/adminBooksManagement.css'


const AdminBooksManagement = () => {
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedDate: '',
    description: '',
    totalCopies: 1,
    cover: '' // just the filename like bc1.jpg
  })
  
  const [books, setBooks] = useState([])

  
  useEffect(() => {
    fetchBooks()
  }, [])
    
  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/books')
      setBooks(res.data.books)
    } catch (err) {
      console.error('Failed to fetch books:', err)
    }
  }
  
  // Filter books based on search term (ID or title)
  const filteredBooks = books.filter(book => 
    book.id.toString().includes(searchTerm) ||
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleAddBook = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/books/create', newBook)
      if (res.data.success) {
        setBooks([...books, res.data.book])
        setNewBook({
          title: '',
          author: '',
          isbn: '',
          category: '',
          publishedDate: '',
          description: '',
          totalCopies: 1,
          cover: ''
        })
        setShowAddForm(false)
        alert('Book Added Successfully!')
      }
    } catch (err) {
    alert(err.response?.data?.message || "Failed to add book");
    console.error("Failed to add book: ", err);
  }
  }
  
  const addCopy = async (bookId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/books/${bookId}/add-copy`)
      if (res.data.success) {
        setBooks(books.map(b => b.id === bookId ? res.data.book : b))
      }
    } catch (err) {
      console.error('Failed to add copy:', err)
    }
  }
  
  const removeCopy = async (bookId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/books/${bookId}/remove-copy`)
      if (res.data.success) {
        setBooks(books.map(b => b.id === bookId ? res.data.book : b))
      }
    } catch (err) {
      console.error('Failed to remove copy:', err)
    }
  }
  
  const removeBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book entirely from the system?')) return
  
    try {
      const res = await axios.delete(`http://localhost:5000/api/books/${bookId}`)
      if (res.data.success) {
        setBooks(books.filter(b => b.id !== bookId))
      }
    } catch (err) {
      console.error('Failed to remove book:', err)
    }
  }

  return (
    <div className="admin-books-page">
      <div className="admin-header-section">
        <div className="admin-page-header">
          <h1>Books Management</h1>
          <button 
            className="admin-btn admin-btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Book
          </button>
        </div>

        <div className="admin-box admin-search-box">
          <div className="admin-search-section">
            <h3>Search Books</h3>
            <div className="admin-search-bar">
              <input
                type="text"
                placeholder="Search by ID, title, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-form-control"
              />
              <button 
                className="admin-btn admin-btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            </div>
            <div className="admin-catalog-stats">
              <span>Showing {filteredBooks.length} of {books.length} books</span>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Add New Book</h3>
              <button 
                className="admin-close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddBook}>
              <div className="admin-grid admin-grid-2">
                <div className="admin-form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Author:</label>
                  <input
                    type="text"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>ISBN:</label>
                  <input
                    type="text"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category:</label>
                  <input
                    type="text"
                    value={newBook.category}
                    onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Total Copies:</label>
                  <input
                    type="number"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({...newBook, totalCopies: e.target.value})}
                    min="1"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Cover Image Filename:</label>
                  <input
                    type="text"
                    value={newBook.cover}
                    onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
                    placeholder="e.g., bc1.jpg"
                    required
                  />
                </div>
                
                <div className="admin-form-group admin-form-group-full">
                  <label>Published Date:</label>
                  <input
                    type="date"
                    value={newBook.publishedDate}
                    onChange={(e) => setNewBook({ ...newBook, publishedDate: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group admin-form-group-full">
                  <label>Description:</label>
                  <textarea
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary">Add Book</button>
                <button 
                  type="button" 
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-books-table-container">
        <div className="admin-box">
          <div className="admin-table-header">
            <h3>Books List</h3>
          </div>
          <div className="admin-table-content">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>ISBN</th>
                    <th>Copies</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => (
                      <tr key={book.id}>
                        <td className="admin-book-id">#{book.id}</td>
                        <td className="admin-book-title">{book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span className="admin-category-tag">
                            {book.category}
                          </span>
                        </td>
                        <td className="admin-isbn">{book.isbn}</td>
                        <td>
                          <span className={`admin-availability ${book.availableCopies > 0 ? 'admin-available' : 'admin-unavailable'}`}>
                            {book.availableCopies}/{book.totalCopies} available
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-buttons">
                            <button 
                              className="admin-btn admin-btn-primary admin-btn-sm"
                              onClick={() => addCopy(book.id)}
                            >
                              Add Copy
                            </button>
                            <button 
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => removeCopy(book.id)}
                              disabled={book.totalCopies <= 0}
                            >
                              Remove Copy
                            </button>
                            <button 
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => removeBook(book.id)}
                            >
                              Remove Book
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="admin-empty-state">
                        No books found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBooksManagement