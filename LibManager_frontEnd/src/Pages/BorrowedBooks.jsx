  import React, { useState, useEffect } from 'react'
  import '../css/pagesCSS/BorrowedBooks.css'
  import axios from 'axios';

  const BorrowedBooks = () => {
    
    const [borrowedBooks, setBorrowedBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => { const fetchBorrowed = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      try {
        const res = await axios.get(`http://localhost:5000/api/borrowed/${user.id}`);
        setBorrowedBooks(res.data.borrowedBooks);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchBorrowed();
    }, []);


    const handleReturn = async (bookId) => {
      const user = JSON.parse(localStorage.getItem("user"));
      
      if (window.confirm("Return this book?")) {
        try {
          const res = await axios.post(
            `http://localhost:5000/api/books/${bookId}/return`,
            { userId: user.id }
          );
  
          if (res.data.success) {
            setBorrowedBooks(borrowedBooks.filter(b => b.bookId !== bookId));
            alert("Book returned successfully!");
          }
        } catch (err) {
          alert(err.response?.data?.message || "Failed to return.");
        }
      }
    };


    const handleRenew = (bookId) => {
      const book = borrowedBooks.find(b => b.id === bookId)
      if (book && book.canRenew) {
        const newDueDate = new Date(book.dueDate)
        newDueDate.setDate(newDueDate.getDate() + 15)
        
        setBorrowedBooks(borrowedBooks.map(b => 
          b.id === bookId 
            ? { 
                ...b, 
                dueDate: newDueDate.toISOString().split('T')[0],
                renewalCount: b.renewalCount + 1,
                canRenew: b.renewalCount + 1 < 2 // Max 2 renewals
              }
            : b
        ))
        alert('Book renewed successfully! New due date: ' + newDueDate.toLocaleDateString())
      }
    }

    const calculateDaysRemaining = (dueDate) => {
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }

    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your borrowed books...</p>
        </div>
      )
    }

    return (
      <div>
        <div className='borrowed-page-header-container'>
          <div className="borrowed-page-header">
            <div>
              <h1>My Borrowed Books</h1>
              <p>Manage your currently borrowed books and check return deadlines</p>
            </div>
            <div className="stats-overview">
              <div className="stat-item">
                <span className="stat-number">{borrowedBooks.length}</span>
                <span className="stat-label">Total Borrowed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number warning">
                  {borrowedBooks.filter(book => book.isOverdue).length}
                </span>
                <span className="stat-label">Overdue</span>
              </div>
            </div>
            <div className="rules-card">
              <h3>Borrowing Rules</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>📚 Maximum borrowing period: <strong>15 days</strong></li>
                <li>🔄 Maximum renewals: <strong>2 times</strong> per book</li>
                <li>⚠️ Late returns result in <strong>warnings</strong></li>
                <li>🚫 <strong>3 warnings</strong> will result in 6-month borrowing suspension</li>
                <li>📅 Renewals extend the due date by another 15 days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className='body-cards'>
          {borrowedBooks.length === 0 ? (
          <div className="card text-center">
            <h3>No Books Borrowed</h3>
            <p>You haven't borrowed any books yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/books'}
            >
              Browse Books
            </button>
          </div>
          ) : (
          <div className="borrowed-books-grid">
            {borrowedBooks.map(book => {
              const daysRemaining = calculateDaysRemaining(book.dueDate)
              const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0
              
              return (
                <div key={book.id} className="borrowed-book-card">
                  <div>

                    <div className="book-header">
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                  </div>
                  
                  <div className="borrow-details">
                    <div className="detail-item">
                      <strong>Borrowed Date:</strong> 
                      {new Date(book.borrowedDate).toLocaleDateString()}
                    </div>
                    <div className="detail-item">
                      <strong>Due Date:</strong> 
                      <span className={book.isOverdue ? 'unavailable' : isDueSoon ? 'warning' : 'available'}>
                        {new Date(book.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong> 
                      <span className={book.isOverdue ? 'unavailable' : isDueSoon ? 'warning' : 'available'}>
                        {book.isOverdue ? 'OVERDUE' : isDueSoon ? `Due in ${daysRemaining} days` : 'On Time'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <strong>Renewals Used:</strong> {book.renewalCount}/2
                    </div>
                  </div>

                  <div className="action-buttons">
                    {!book.isOverdue && book.canRenew && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleRenew(book.id)}
                      >
                        Renew Book
                      </button>
                    )}
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleReturn(book.bookId)}
                    >
                      Return Book
                    </button>
                  </div>

                  {book.isOverdue && (
                    <div className="warning-message">
                      ⚠️ This book is overdue! Please return it immediately to avoid warnings.
                    </div>
                  )}
                  {isDueSoon && !book.isOverdue && (
                    <div className="warning-message">
                      ⏰ This book is due soon! Please return or renew it.
                    </div>
                  )}

                  </div>


                  <div>

                    <div className="borrowed-cover">
                    <img 
                      src={book.cover}
                      alt={book.title} 
                    />
                    </div>

                  </div>
                  
                </div>
              )
            })}
          </div>
          )}

        </div>
      </div>
    )
  }

  export default BorrowedBooks