import React from 'react'
import { Link } from 'react-router-dom'
import '../css/pagesCSS/Dashboard.css'

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p>Student Dashboard</p>
      </div>
      
      <div className="grid grid-3">
        <div className="dash-card">
          <h3>📚 Browse Books</h3>
          <p>Explore our collection of books</p>
          <Link to="/books" className="btn btn-primary">View Catalog</Link>
        </div>
        
        <div className="dash-card">
          <h3>📖 My Borrowed Books</h3>
          <p>Check your currently borrowed books</p>
          <Link to="/borrowed" className="btn btn-primary">View My Books</Link>
        </div>
        
        <div className="dash-card">
          <h3>📊 Statistics</h3>
          <p>See popular books and trends</p>
          <Link to="/statistics" className="btn btn-primary">View Statistics</Link>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard