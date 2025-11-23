import React, { useState, useEffect } from 'react'
import '../css/pagesCSS/Statistics.css'

const Statistics = () => {
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState('month')
  const user = JSON.parse(localStorage.getItem('user'))

  // Mock statistics data
  const mockStats = {
    overview: {
      totalBooks: 1250,
      totalBorrows: 8432,
      activeStudents: 450,
      popularCategories: ['Fiction', 'Science', 'History', 'Technology', 'Biography']
    },
    popularBooks: [
      { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowCount: 156 },
      { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', borrowCount: 142 },
      { id: 3, title: '1984', author: 'George Orwell', borrowCount: 138 },
      { id: 4, title: 'The Hobbit', author: 'J.R.R. Tolkien', borrowCount: 125 },
      { id: 5, title: 'Pride and Prejudice', author: 'Jane Austen', borrowCount: 118 }
    ],
    categoryStats: [
      { category: 'Fiction', count: 450, percentage: 36, color: '#3498db' },
      { category: 'Science', count: 280, percentage: 22.4, color: '#2ecc71' },
      { category: 'History', count: 195, percentage: 15.6, color: '#e74c3c' },
      { category: 'Technology', count: 150, percentage: 12, color: '#f39c12' },
      { category: 'Biography', count: 175, percentage: 14, color: '#9b59b6' }
    ],
    monthlyTrends: [
      { month: 'Jan', borrows: 650 },
      { month: 'Feb', borrows: 720 },
      { month: 'Mar', borrows: 810 },
      { month: 'Apr', borrows: 780 },
      { month: 'May', borrows: 850 },
      { month: 'Jun', borrows: 920 }
    ],
    studentStats: {
      topBorrowers: [
        { name: 'John Smith', borrowCount: 23 },
        { name: 'Sarah Johnson', borrowCount: 19 },
        { name: 'Mike Davis', borrowCount: 17 },
        { name: 'Emily Wilson', borrowCount: 16 },
        { name: 'David Brown', borrowCount: 15 }
      ],
      warnings: {
        totalWarnings: 12,
        studentsWithWarnings: 8,
        suspendedAccounts: 2
      }
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats)
    }, 1000)
  }, [timeRange])

  if (!stats) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Library Statistics</h1>
          <p>Insights and analytics about library usage and book popularity</p>
        </div>
        <div className="time-filter">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="btn btn-secondary"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.overview.totalBooks}</span>
          <span className="stat-label">Total Books</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.overview.totalBorrows}</span>
          <span className="stat-label">Total Borrows</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.overview.activeStudents}</span>
          <span className="stat-label">Active Students</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.studentStats.warnings.suspendedAccounts}</span>
          <span className="stat-label">Suspended Accounts</span>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Popular Books */}
        <div className="stats-card">
          <h3>📊 Most Popular Books</h3>
          <div className="popular-books-list">
            {stats.popularBooks.map((book, index) => (
              <div key={book.id} className="popular-book-item">
                <div>
                  <div className="book-rank">#{index + 1}</div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">( by {book.author} )</div>
                </div>
                <div className="borrow-count">{book.borrowCount} borrows</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution - Pie Chart */}
        <div className="stats-card">
          <h3>📚 Books by Category</h3>
          <div className="pie-chart-container">
            <div className="pie-chart">
              {stats.categoryStats.map((cat, index, array) => {
                const previousPercentages = array
                  .slice(0, index)
                  .reduce((sum, item) => sum + (item.percentage / 100) * 360, 0);
                
                return (
                  <div
                    key={cat.category}
                    className="pie-segment"
                    style={{
                      backgroundColor: cat.color,
                      transform: `rotate(${previousPercentages}deg)`,
                      clipPath: `conic-gradient(from 0deg at 50% 50%, ${cat.color} 0% ${cat.percentage}%, transparent ${cat.percentage}% 100%)`
                    }}
                    title={`${cat.category}: ${cat.count} books (${cat.percentage}%)`}
                  ></div>
                );
              })}
            </div>
            <div className="pie-legend">
              {stats.categoryStats.map(cat => (
                <div key={cat.category} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="legend-label">
                    {cat.category}: {cat.count} books ({cat.percentage}%)
                  </span> 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Last two cards side by side */}
      <div className="grid grid-2">
        {/* Borrowing Trends */}
      {/* Monthly Trends */}
<div className="stats-card">
  <h3>📈 Borrowing Trends</h3>
  <div className="bar-chart-container">
    <div className="bar-chart">
      {stats.monthlyTrends.map(month => {
        const maxBorrows = Math.max(...stats.monthlyTrends.map(m => m.borrows));
        const percentage = (month.borrows / maxBorrows) * 100;
        
        return (
          <div key={month.month} className="bar-column">
            <div 
              className="bar"
              style={{ height: `${percentage}%` }}
              title={`${month.borrows} borrows`}
            >
              <span className="bar-value">{month.borrows}</span>
            </div>
            <div className="bar-label">{month.month}</div>
          </div>
        );
      })}
    </div>
  </div>
</div>

        {/* Reading Suggestions - Only for students */}
        {user.role === 'student' && (
          <div className="stats-card">
            <h3>💡 Reading Suggestions</h3>
            <p>Based on popular books among students, you might enjoy:</p>
            <div className="suggestions-list">
              {stats.popularBooks.slice(0, 3).map(book => (
                <div key={book.id} className="suggestion-item">
                  <div className="suggestion-book">
                    <strong>{book.title}</strong> by {book.author}
                  </div>
                  <div className="suggestion-stats">
                    {book.borrowCount} students have borrowed this
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin sections when user is admin */}
        {user.role === 'admin' && (
          <>
            {/* Top Borrowers */}
            <div className="stats-card">
              <h3>👥 Top Borrowers</h3>
              <div className="top-borrowers">
                {stats.studentStats.topBorrowers.map((student, index) => (
                  <div key={student.name} className="borrower-item">
                    <div>
                      <div className="borrower-rank">#{index + 1}</div>
                      <div className="borrower-name">{student.name}</div>
                    </div>
                    <div>
                        <div className="borrower-count">{student.borrowCount} books</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings Overview */}
            <div className="stats-card">
              <h3>⚠️ Warnings Overview</h3>
              <div className="warnings-stats">
                <div className="warning-item">
                  <span className="warning-label">Total Warnings Issued</span>
                  <span className="warning-count">{stats.studentStats.warnings.totalWarnings}</span>
                </div>
                <div className="warning-item">
                  <span className="warning-label">Students with Warnings</span>
                  <span className="warning-count">{stats.studentStats.warnings.studentsWithWarnings}</span>
                </div>
                <div className="warning-item">
                  <span className="warning-label">Suspended Accounts</span>
                  <span className="warning-count warning">{stats.studentStats.warnings.suspendedAccounts}</span>
                </div>
              </div>
              <div className="warning-note">
                <p>Students are suspended after accumulating 3 warnings.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Statistics 