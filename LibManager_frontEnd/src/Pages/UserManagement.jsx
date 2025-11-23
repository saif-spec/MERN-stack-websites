import React, { useState, useEffect } from 'react'
import '../css/pagesCSS/userManagement.css'
import axios from 'axios'


const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showModifyForm, setShowModifyForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    id: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  })
  const [modifiedStudent, setModifiedStudent] = useState({
    name: '',
    email: '',
    id: '',
    warnings: 0,
    isActive: true
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [passwordError, setPasswordError] = useState('')


  // Get All users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        // Fallback to mock data if API fails
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault()
    
    // Validate passwords
    if (newUser.password !== newUser.confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    if (newUser.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }
  
    try {
      const res = await axios.post('http://localhost:5000/api/users/create', {
        name: newUser.name,
        email: newUser.email,
        id: newUser.id,
        role: newUser.role,
        password: newUser.password
      });
  
      if (res.data.success) {
        setUsers([...users, res.data.user]);
        setNewUser({
          name: '',
          email: '',
          id: '',
          role: 'student',
          password: '',
          confirmPassword: ''
        });
        setPasswordError('');
        setShowAddForm(false);
        alert('User added successfully!');
      }
    } catch (err) {
      console.error('Failed to add user:', err);
      if (err.response && err.response.data.message) {
        setPasswordError(err.response.data.message);
      } else {
        setPasswordError('Failed to add user. Please try again.');
      }
    }
  }

  const handleModifyStudent = (userId) => {
    const student = users.find(u => u.id === userId && u.role === 'student')
    if (student) {
      setSelectedStudent(student)
      setModifiedStudent({
        name: student.name,
        email: student.email,
        id: student.id,
        warnings: student.warnings,
        isActive: student.isActive
      })
      setShowModifyForm(true)
    }
  }

  const handleUpdateStudent = async (e) => {
    e.preventDefault()
    
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${selectedStudent.id}`, {
        name: modifiedStudent.name,
        email: modifiedStudent.email,
        id: modifiedStudent.id,
        warnings: modifiedStudent.warnings,
        isActive: modifiedStudent.isActive
      });
  
      if (res.data.success) {
        setUsers(users.map(user => 
          user.id === selectedStudent.id ? res.data.user : user
        ));
        setShowModifyForm(false);
        setSelectedStudent(null);
        alert('Student information updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update student:', err);
      alert('Failed to update student information. Please try again.');
    }
  }

  const handleCancelModify = () => {
    setShowModifyForm(false)
    setSelectedStudent(null)
    setModifiedStudent({
      name: '',
      email: '',
      id: '',
      warnings: 0,
      isActive: true
    })
  }


  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )

  const students = filteredUsers.filter(u => u.role === 'student')
  const admins = users.filter(u => u.role === 'admin')

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage student accounts and administrator access</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New User
        </button>
      </div>

            {/* Add User Form - Fixed to be modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="box" style={{ margin: 0, border: 'none' }}>
              <h3>Add New User</h3>
              <form onSubmit={handleAddUser}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Student ID:</label>
                    <input
                      type="text"
                      value={newUser.id}
                      onChange={(e) => setNewUser({...newUser, id: e.target.value})}
                      placeholder="Leave empty for admin"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role:</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => {
                        setNewUser({...newUser, password: e.target.value})
                        setPasswordError('')
                      }}
                      required
                      minLength="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => {
                        setNewUser({...newUser, confirmPassword: e.target.value})
                        setPasswordError('')
                      }}
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                
                {passwordError && (
                  <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                    {passwordError}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">Add User</button>
                  <button 
  className="close-btn"
  onClick={() => {
    setShowAddForm(false)
    setPasswordError('')
  }}
>
  ×
</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modify Student Form */}
      {showModifyForm && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="box" style={{ margin: 0, border: 'none' }}>
                        <h3>Modify Student Information</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Editing: <strong>{selectedStudent.name}</strong> (ID: #{selectedStudent.id})
                </p>
                <form onSubmit={handleUpdateStudent}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label>Full Name:</label>
                      <input
                        type="text"
                        value={modifiedStudent.name}
                        onChange={(e) => setModifiedStudent({...modifiedStudent, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        value={modifiedStudent.email}
                        onChange={(e) => setModifiedStudent({...modifiedStudent, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Student ID:</label>
                      <input
                        type="text"
                        value={modifiedStudent.id}
                        onChange={(e) => setModifiedStudent({...modifiedStudent, id: e.target.value})}
                        required
                      />
                    </div>
                    
                    
                    
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">Update Student</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancelModify}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="box search-box">
        <div className="form-group seach-form-group">
          <label>Search Users:</label>
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='admin-main-box'>
                {/* Students Section */}
        <div className="box1">
          <div className="section-header">
            <h3>👥 Students ({students.length})</h3>
          </div>
  
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="scroll-body">
                {students.map(user => (
                  <tr key={user.id} className={!user.isActive ? 'inactive-user' : ''}>
                    <td>
                      <strong>#{user.id}</strong>
                    </td>
                    <td>
                      <div className="user-info">
                        <strong>{user.name}</strong>
                        
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleModifyStudent(user.id)}
                        >
                          Modify Student Info
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Administrators Section */}
        <div className="box box2">
          <h3>👑 Administrators ({admins.length})</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(user => (
                  <tr key={user.id}>
                    <td><strong>#{user.id}</strong></td>
                    <td>
                      <div className="user-info">
                        <strong>{user.name}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    
                    <td>
                      <span className="status available">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>


      {/* Auto Sign-up Feature */}
      <div className="box">
        <h3>🔄 Auto Sign-up Feature</h3>
        <p>
          This feature automatically creates library accounts for new students and removes 
          accounts for graduated students by syncing with the university database.
        </p>
        <div className="auto-signup-actions">
          <button className="btn btn-secondary">
            View Sync Log
          </button>
        </div>
        <div className="feature-info">
          <p><strong>Next scheduled sync:</strong> Beginning of next semester</p>
          <p><strong>Last sync:</strong> 2024-01-15 - Added 250 new students, removed 180 graduated students</p>
        </div>
      </div>
    </div>
  )
}

export default UserManagement