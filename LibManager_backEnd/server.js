const express = require('express');
const cors = require('cors');
const app = express();
const path = require("path");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use('/booksCovers', express.static('public/booksCovers'))

// Mock database (will be replaced with MongoDB later)


let users = [
      {
        id: 12345,
        name: 'John Smith',
        email: 'john.smith@university.edu',
        password: 'password123', // In real app, this would be hashed
        role: 'student',
        warnings: 0,
        isActive: true,
        joinDate: '2023-09-01',
        borrowedBooks: 3
      },
      {
        id: 12346,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        password: 'password123', // In real app, this would be hashed
        role: 'student',
        warnings: 2,
        isActive: true,
        joinDate: '2023-09-01',
        borrowedBooks: 5
      },
      {
        id: 12347,
        name: 'Mike Davis',
        email: 'mike.davis@university.edu',
        password: 'password123', // In real app, this would be hashed
        role: 'student',
        warnings: 1,
        isActive: true,
        joinDate: '2023-09-01',
        borrowedBooks: 2
      },
      {
        id: 4,
        name: 'Admin User',
        email: 'admin@library.edu',
        password: 'password123', // In real app, this would be hashed
        role: 'admin',
        warnings: 0,
        isActive: true,
        joinDate: '2023-08-15',
        borrowedBooks: 0
      },
      {
        id: 12348,
        name: 'Emily Wilson',
        email: 'emily.wilson@university.edu',
        password: 'password123', // In real app, this would be hashed
        role: 'student',
        warnings: 3,
        isActive: false,
        joinDate: '2023-09-01',
        borrowedBooks: 0,
        suspensionEnd: '2024-07-01'
      },
      {
        id: 6,
        name: 'Admin User2',
        email: 'admin2@library.edu',
        password: 'password123', // In real app, this would be hashed
        role: 'admin',
        warnings: 0,
        isActive: false,
        joinDate: '2023-08-15',
        borrowedBooks: 0,
      }
    ];


let borrowedBooks = [];

// Mock books database
let books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    publishedDate: '1925-04-10',
    description: 'A classic novel of the Jazz Age...',
    totalCopies: 5,
    availableCopies: 3,
    borrowedCount: 45,
    rating: 4.5,
    cover: `http://localhost:5000/booksCovers/bc1.jpg` // You'll need to handle image serving
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    publishedDate: '1960-07-11',
    description: 'A gripping tale of racial injustice...',
    totalCopies: 4,
    availableCopies: 2,
    borrowedCount: 38,
    rating: 4.8,
    cover: `http://localhost:5000/booksCovers/bc2.jpg`
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    category: 'Science Fiction',
    publishedDate: '1949-06-08',
    description: 'A dystopian social science fiction novel...',
    totalCopies: 6,
    availableCopies: 4,
    borrowedCount: 52,
    rating: 4.7,
    cover: `http://localhost:5000/booksCovers/bc3.jpg`
  }
];


// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password ) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Find user in mock database
  const user = users.find(u => 
    u.email === email && 
    u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Remove password from response for security
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login successful',
    user: userWithoutPassword,
    token: 'mock-jwt-token-' + user.id // In real app, use proper JWT
  });
});


// Get all books endpoint
app.get('/api/books', (req, res) => {
  const { category, search } = req.query;
  
  let filteredBooks = books;

  // Filter by category if provided
  if (category) {
    filteredBooks = filteredBooks.filter(book => 
      book.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search term if provided
  if (search) {
    const term = search.toLowerCase();
    filteredBooks = books.filter(book =>
      book.id.toString().includes(term) ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  }

  res.json({
    success: true,
    books: filteredBooks,
    total: filteredBooks.length
  });
});


// Add a new book
app.post('/api/books/create', (req, res) => {
  const { title, author, isbn, category, publishedDate, description, totalCopies, cover } = req.body;

  // Path where book covers are located
  const coverPath = path.join(__dirname, "public", "booksCovers", cover);

  // Check if the cover image exists
  if (!fs.existsSync(coverPath)) {
    return res.status(400).json({ 
      success: false, 
      message: "Book cover not found on server" 
    });
  }

  // Generate book ID
  const id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;

  const newBook = {
    id,
    title,
    author,
    isbn,
    category,
    publishedDate,
    description,
    totalCopies: parseInt(totalCopies),
    availableCopies: parseInt(totalCopies),
    borrowedCount: 0,
    rating: 0,
    cover: `http://localhost:5000/booksCovers/${cover}`
  };
  books.push(newBook);

  res.json({ success: true, book: newBook });
});


// Add a book copy
app.post('/api/books/:id/add-copy', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

  book.totalCopies += 1;
  book.availableCopies += 1;
  res.json({ success: true, book });
});


// Remove a book copy
app.post('/api/books/:id/remove-copy', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

  if (book.totalCopies > 0) {
    book.totalCopies -= 1;
    book.availableCopies = Math.max(0, book.availableCopies - 1);
  }

  res.json({ success: true, book });
});


// Remove a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter(b => b.id !== bookId);
  res.json({ success: true, message: 'Book removed successfully' });
});


// Get a single book by ID
app.get('/api/books/:id', (req, res) => {
  
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }

  res.json({
    success: true,
    book: book
  });
});


// Get all users (students and admins)
app.get('/api/users', (req, res) => {
  try {
    // In a real app, this would come from database
    

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});


// Create a new user (student or admin)
app.post('/api/users/create', (req, res) => {
  try {
    const { name, email, id, role, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => 
      user.email === email || user.id.toString() === id.toString()
    );
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or ID already exists'
      });
    }
    
    let newUser;

    if (role === 'student') {
      // For students, use the provided id
      newUser = {
        id: id, // Use the provided id directly
        name,
        email,
        password,
        role,
        warnings: 0,
        isActive: true,
        joinDate: new Date().toISOString().split('T')[0],
        borrowedBooks: 0
      };
    } else {
      // For admins, generate a new numeric ID
      const adminUsers = users.filter(u => u.role === 'admin');
      const newId = adminUsers.length > 0 ? Math.max(...adminUsers.map(u => parseInt(u.id))) + 1 : 1000;
      
      newUser = {
        id: newId,
        name,
        email,
        password,
        role,
        warnings: 0,
        isActive: true,
        joinDate: new Date().toISOString().split('T')[0],
        borrowedBooks: 0
      };
    }

    users.push(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});


// Update a user data
app.put('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id; // Keep as string to handle both string and number IDs
    const { name, email, id, warnings, isActive } = req.body;
    
    const userIndex = users.findIndex(user => user.id.toString() === userId.toString());
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      id: id, // Update the id if changed
      warnings,
      isActive
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      user: users[userIndex]
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});


// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await users.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has borrowed books
    const borrowedBooksCount = await borrowedBooks.countDocuments({ 
      id: user._id, 
      returned: false 
    });
    
    if (borrowedBooksCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with borrowed books'
      });
    }

    await users.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});


// Add a warning to a student
app.post('/users/:id/add-warning', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'Can only add warnings to students'
      });
    }

    user.warnings += 1;
    
    // Auto-suspend if warnings reach 3
    if (user.warnings >= 3) {
      user.isActive = false;
      const suspensionEnd = new Date();
      suspensionEnd.setMonth(suspensionEnd.getMonth() + 6); // 6 months suspension
      user.suspensionEnd = suspensionEnd;
    }

    await user.save();

    const userResponse = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: user.warnings >= 3 ? 
        'Warning added. User has been suspended for 6 months.' : 
        'Warning added successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Error adding warning:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add warning'
    });
  }
});


// Remove a warning from a student
app.post('/users/:id/remove-warning', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'Can only remove warnings from students'
      });
    }

    user.warnings = Math.max(0, user.warnings - 1);
    
    // Reactivate if warnings are below 3
    if (user.warnings < 3) {
      user.isActive = true;
      user.suspensionEnd = null;
    }

    await user.save();

    const userResponse = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Warning removed successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Error removing warning:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove warning'
    });
  }
});


// Activate/Deactivate user account ( not used yet )
app.post('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate administrator accounts'
      });
    }

    // Check if trying to activate a user with 3 warnings
    if (user.warnings >= 3 && !user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot activate user with 3 warnings. Remove warnings first.'
      });
    }

    user.isActive = !user.isActive;
    
    // Clear suspension if activating
    if (user.isActive) {
      user.suspensionEnd = null;
    }

    await user.save();

    const userResponse = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: user.isActive ? 'User activated successfully' : 'User suspended successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    });
  }
});


// Get the borrowed books of a user
app.get("/api/borrowed/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  const userBorrowedBooks = borrowedBooks.filter(b => b.userId === userId);
    
  const borrowedWithDetails = userBorrowedBooks.map(borrowed => {
    const book = books.find(b => b.id === borrowed.bookId);
    const today = new Date();
    const dueDate = new Date(borrowed.dueDate);
    const isOverdue = dueDate < today;
    const canRenew = borrowed.renewalCount < 2 && !isOverdue;

  return {
    ...borrowed,
    title: book.title,
    author: book.author,
    category: book.category,
    cover: book.cover,
    isOverdue,
    canRenew
  };
});
  res.json({ success: true, borrowedBooks: borrowedWithDetails });
});


// Borrow a book
app.post("/api/books/:id/borrow", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { userId } = req.body;

  const book = books.find(b => b.id === bookId);
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });

  if (book.availableCopies <= 0)
    return res.status(400).json({ success: false, message: "No copies available" });

  // Check if user has already borrowed this book and hasn't returned it
  const alreadyBorrowed = borrowedBooks.find(
    b => b.userId === userId && b.bookId === bookId
  );

  if (alreadyBorrowed) {
    return res.status(400).json({ 
      success: false, 
      message: "You have already borrowed this book! Please return it before borrowing again." 
    });
  }

  const borrowedDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(borrowedDate.getDate() + 15);

  borrowedBooks.push({
    id: borrowedBooks.length + 1,
    userId,
    bookId,
    borrowedDate: borrowedDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    renewalCount: 0,
  });


  borrowedBooks.map( borrowed => {
  })

  book.availableCopies--;
  book.borrowedCount++;
  res.json({ success: true, message: "Book borrowed successfully" });
});


// Return a book
app.post("/api/books/:id/return", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { userId } = req.body;


  // Find the borrowed record by both userId AND bookId

  const ifBorrowed = borrowedBooks.find(
    b => b.userId === userId && b.bookId === bookId
  );

  const entryIndex = borrowedBooks.findIndex(
    b => b.userId === userId && b.bookId === bookId
  );

  if (entryIndex === -1) {
    
    return res.status(404).json({ success: false, message: "Borrowed record not found" });
  }

  // Remove the found record
  borrowedBooks.splice(entryIndex, 1);

  // Update the book's available copies
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }
  
  book.availableCopies++;

  res.json({ success: true, message: "Book returned successfully" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});