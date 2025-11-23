import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/pagesCSS/bookDetails.css'
import axios from 'axios'

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [similarBooks, setSimilarBooks] = useState([])

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(`http://localhost:5000/api/books/${id}`)
        
        if (response.data.success) {
          setBook(response.data.book)
          
          // Fetch similar books (same category, excluding current book)
          const similarResponse = await axios.get(`http://localhost:5000/api/books?category=${response.data.book.category}`)
          if (similarResponse.data.success) {
            const filteredSimilar = similarResponse.data.books.filter(b => b.id !== response.data.book.id)
            setSimilarBooks(filteredSimilar)
          }
        }
        const imageModule = await import(/* @vite-ignore */`../resources/booksCovers/${response.data.book.cover}`);
        setCoverImage(imageModule.default);
      } catch (error) {
        console.error('Error fetching book details:', error)
        setError('Failed to load book details')
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [id])

  const handleBorrow = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/books/${id}/borrow`,
        { userId: user.id }
      );
  
      if (response.data.success) {
        alert("Book borrowed successfully!");
  
        setBook(prev => ({
          ...prev,
          availableCopies: prev.availableCopies - 1,
          borrowedCount: prev.borrowedCount + 1,
        }));
      }
    } catch (err) {
      if (err.response?.status === 400) {
        // Specific error for already borrowed or no copies available
        alert(err.response.data.message);
      } else if (err.response?.status === 404) {
        alert("Book not found.");
      } else {
        alert("Failed to borrow book. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="card text-center">
        <h2>Book Not Found</h2>
        <p>{error || 'The book you\'re looking for doesn\'t exist.'}</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/books')}
        >
          Back to Catalog
        </button>
      </div>
    )
  }


  return (
    <div className='book-details-container'>
      <button 
        className="btn btn-secondary mb-3"
        onClick={() => navigate('/books')}
      >
        ← Back to Catalog
      </button>

      <div className="grid grid-2">
        <div>
          <div className="card-bookDet">
            <div className='bookinfo'>
              <div>
                <div className="book-header">
                 <h1>{book.title}</h1>
                 <p className="author">by {book.author}</p>
                  <div className="book-meta">
                   <span className={`status ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                    {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                   </span>
                   <span className="rating">⭐ {book.rating}/5</span>
                  </div>
                </div>
    
                <div className="book-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Category:</strong> {book.category}
                    </div>
                    <div className="info-item">
                      <strong>ISBN:</strong> {book.isbn}
                    </div>
                    <div className="info-item">
                      <strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}
                    </div>
                    <div className="info-item">
                      <strong>Available Copies:</strong> {book.availableCopies}/{book.totalCopies}
                    </div>
                    <div className="info-item">
                      <strong>Times Borrowed:</strong> {book.borrowedCount}
                    </div>
                  </div>
                </div>
              </div>
              <div><img src={book.cover} alt={book.title} /></div>
            </div>
          
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
            
            {JSON.parse(localStorage.getItem('user')).role === 'student' && (
              <div className="borrow-section">
                <button 
                  className="btn btn-primary"
                  onClick={handleBorrow}
                  disabled={book.availableCopies === 0}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {book.availableCopies > 0 ? 'Borrow This Book' : 'Currently Unavailable'}
                </button>
                <p className="borrow-note">
                  Borrowing period: 15 days • Late returns result in warnings
                </p>
              </div>
            )}
              
          </div>          
        </div>

        <div className="bookDet-similarBks">
          <h3>Similar Books :</h3>
          <div>
            {similarBooks.length > 0 ? (
              similarBooks.map(similarBook => (
                <div 
                  key={similarBook.id} 
                  className="similar-book-item"
                  onClick={() => navigate(`/book/${similarBook.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='similar-book-item-lv2'>
                    <h4>{similarBook.title}</h4>                  
                    <span className={`status-small ${similarBook.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                      {similarBook.availableCopies > 0 ? '(Available)' : '(Unavailable)'}
                    </span>
                  </div>
                  <p>by {similarBook.author}</p>
                </div>
              ))
            ) : (
              <p>No similar books found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails