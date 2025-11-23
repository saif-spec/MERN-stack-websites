import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/componentsCSS/Layout.css'

const Layout = ({ children, user, setUser }) => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser({ role: 'guest' }) // update parent state
    setDropdownOpen(false)
    navigate('/login')
  }

  const toggleDropdown = () => setDropdownOpen(prev => !prev)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <Link to="/">📚 Library Manager</Link>
          </div>

          <div className="nav-links">
            {user.role === 'student' && (
              <>
                <Link to="/student">Dashboard</Link>
                <Link to="/books">Books Catalog</Link>
                <Link to="/borrowed">My Books</Link>
                <Link to="/statistics">Statistics</Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/books">Manage Books</Link>
                <Link to="/admin/users">Manage Users</Link>
                <Link to="/statistics">Statistics</Link>
              </>
            )}

            {user.role !== 'guest' && (
              <div className="dropdown" ref={dropdownRef}>
                <span className="nav-username" onClick={toggleDropdown}>
                  👤 {user.name} ▾
                </span>
                {dropdownOpen && (
                  <div className="dropdown-menu show">
                    <div className="dropdown-content">
                      <button className="dropdown-btn" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

export default Layout