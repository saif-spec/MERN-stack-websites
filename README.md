# Library Management System

A full-stack university library managment system with:

- React frontend
- Node.js + Express backend
- Local in-memory data (no database)
- Borrow / Return / Renew system
- Overdue tracking
- Admin books and users management

## Setup Instructions

### Backend:
cd backend
npm install
node server.js

### Frontend:
cd frontend
npm install
npm start

## Notes (future work) :
- the 'Statistics' page is static and not connected with the backend (yet).
- currently there is only ERN and no mongoDB configurations, just front-end and back-end endpoints.
- currently there is an 'addWarrning' endpoint in the server but it is not used yet.
- the warnings system should be automatic ( when a student pass the overdue of a borrowed book, he gets penlized with a warning automatically ).
- the covers images are in the 'public/BooksCovers/' folder, you can add any book cover image you want (must be .jpg), and when choosing it in the addBook form, use its exactname (ex: cover_image.jpg)
