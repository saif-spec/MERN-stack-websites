import React from 'react'
import { Link } from 'react-router-dom'
import '../css/pagesCSS/Dashboard.css'


const AdminDashboard = () => {
  return (
    <div>
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Library Management System</p>
      </div>
      
      <div className="grid grid-3">
        <div className="dash-card">
          <h3>📚 Manage Books</h3>
          <p>Add, edit, or remove books from the library</p>
          <Link to="/admin/books" className="btn btn-primary">Manage Books</Link>
        </div>
        
        <div className="dash-card">
          <h3>👥 Manage Users</h3>
          <p>Add new students or administrators</p>
          <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
        </div>
        
        <div className="dash-card">
          <h3>📊 Statistics</h3>
          <p>View library usage statistics</p>
          <Link to="/statistics" className="btn btn-primary">View Statistics</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard