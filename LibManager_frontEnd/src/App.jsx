import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './Pages/Login'
import StudentDashboard from './Pages/StudentDashboard'
import AdminDashboard from './Pages/AdminDashboard'
import BooksCatalog from './Pages/BooksCatalog'
import BookDetails from './Pages/BookDetails'
import BorrowedBooks from './Pages/BorrowedBooks'
import Statistics from './Pages/Statistics'
import AdminBooksManagement from './Pages/AdminBooksManagement'
import UserManagement from './Pages/UserManagement'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { role: 'guest' })

  return (
    <Layout user={user} setUser={setUser}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/books" element={<BooksCatalog />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/borrowed" element={<BorrowedBooks />} />
        <Route path="/statistics" element={<Statistics />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBooksManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </Layout>
  )
}

export default App