import React, { useState, useEffect } from 'react'
import '../css/pagesCSS/BooksCatalog.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

const BooksCatalog = () => {
  const [books, setBooks] = useState([])
  const [allBooks, setAllBooks] = useState([]) // Store all books from API
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  })

  // Fetch all books from API on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5000/api/books')
        
        if (response.data.success) {
          setAllBooks(response.data.books)
          setBooks(response.data.books)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
        // Fallback to local data if API fails
        const fallbackBooks = [
          {
            id: 1,
            cover: bc1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            category: 'Fiction',
            publishedDate: '1925-04-10',
            availableCopies: 3,
            totalCopies: 5
          },
          {
            id: 2,
            cover: bc2,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            category: 'Fiction',
            publishedDate: '1960-07-11',
            availableCopies: 2,
            totalCopies: 4
          }
        ]
        setAllBooks(fallbackBooks)
        setBooks(fallbackBooks)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Filter books locally when filters change
  useEffect(() => {
    let filtered = allBooks

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(book => 
        book.category.toLowerCase() === filters.category.toLowerCase()
      )
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setBooks(filtered)
  }, [filters, allBooks])

  // Handle search input change - update immediately
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
  }

  // Handle category change
  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }))
  }

  // Handle image error - fallback to local images
  const handleImageError = (e, bookId) => {
    if (bookId === 1) e.target.src = bc1
    else if (bookId === 2) e.target.src = bc2
    else e.target.src = bc1
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    )
  }

  return (
    <div className='catalog-main'>
    
        <div className='catalog-header-container'>
      <div className="catalog-header">
        <h1>Books Catalog</h1>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={filters.search}
            onChange={handleSearchChange}
          />
      
          <div className='cats'>
            Category :
            <select
              value={filters.category}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              <option value="Fiction">Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="History">History</option>
            </select>
          </div>
        </div>
      </div>
    
        </div>
    
    
    
      <div className="catalog-body">
        {books.map(book => (
          <div key={book.id} className="catalog-body-row">
            <img
              src={book.cover} 
              alt={book.title}
              className='bookCover'
              onError={(e) => handleImageError(e, book.id)}
            />
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Published:</strong> {book.publishedDate}</p>
            <p><strong>Available:</strong> {book.availableCopies}/{book.totalCopies}</p>
            <Link 
              to={`/book/${book.id}`} 
              className="btn btn-primary"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    
      {books.length === 0 && !loading && (
        <div className="no-books">
          <p>No books found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default BooksCatalog