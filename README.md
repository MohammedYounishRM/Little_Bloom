• Little Bloom
        » A full-stack early childhood management application designed to streamline student tracking, attendance logging, and growth record monitoring. Built with React and Node.js, and deployed on Render.

• Live Application
        Access the live production web app here:

        https://little-bloom.onrender.com

• Features
  » User Authentication: Secure user signup, login, and email verification powered by JWTs and Brevo REST API.

  » Attendance Tracking: Real-time marking and history logging for student attendance.

  » Child & Growth Records: Centralized dashboard for managing children profiles and monitoring growth metrics.

  » Responsive Interface: Clean desktop and mobile UI layout with automatic scroll management.

• Tech Stack
  » Frontend
      React.js (Vite)
      Lucide React

  Axios for API requests

  » Backend
      Node.js & Express.js

  PostgreSQL (Hosted on Neon.tech)

  Brevo API for transactional email delivery

  Cookie-parser & JSON Web Tokens (JWT) for authentication

• Infrastructure & Deployment
  Hosted on Render (Single Web Service architecture)

  PostgreSQL Database hosted on Neon serverless database

• Environment Variables
    To run this project locally, configure the following environment variables:

Backend (/backend/.env)

  PORT=5000
  NODE_ENV=development
  DATABASE_URL=your_neon_postgresql_connection_string
  JWT_SECRET=your_jwt_secret_key
  BREVO_API_KEY=your_brevo_v3_api_key
  VERIFIED_SENDER_EMAIL=your_verified_brevo_email

Frontend (/frontend/.env)

  VITE_API_BASE_URL=http://localhost:5000

• Getting Started Locally

  » Prerequisites
        Node.js (v18 or higher)

  PostgreSQL database instance (or Neon DB connection string)

  » Installation
      Clone the repository:

  git clone https://github.com/your-username/little-bloom.git

  cd little-bloom

» Install dependencies for both frontend and backend:

  cd backend && npm install
  cd ../frontend && npm install

» Run the development servers:

  Backend: npm run dev (inside /backend)

  Frontend: npm run dev (inside /frontend)

License
Distributed under the MIT License.
