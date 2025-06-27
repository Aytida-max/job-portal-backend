# Job Portal - Backend API

This repository contains the backend server for a full-stack Job Portal application. It provides a robust RESTful API for user authentication, company management, job postings, and application processing.

This backend is designed to work with its corresponding [React Frontend Repository](https://github.com/Aytida-max/job-portal-frontend).

---

## Features

- **Secure Authentication:** User registration and login using JSON Web Tokens (JWT) with password hashing (`bcryptjs`). Sessions are managed with secure `httpOnly` cookies.
- **Role-Based Access Control:** Middleware protects routes, ensuring only authenticated admins/recruiters can post jobs or register companies.
- **Full CRUD for Jobs:** API endpoints to create, read, update, and delete job postings.
- **Full CRUD for Companies:** API endpoints to create, read, update, and manage company profiles.
- **Advanced Filtering:** A powerful `GET` endpoint for jobs that allows for dynamic filtering by keyword, location, job type, experience, and salary.
- **Data Population:** Efficiently sends related data (e.g., full company details are populated within job objects).
- **Application System:** Endpoints for users to apply for jobs.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Token (jsonwebtoken), bcryptjs
- **Middleware:** cookie-parser, cors

---

## API Endpoints

Here is a summary of the main API routes available.

| Method | Endpoint                       | Description                                | Access   |
| :----- | :----------------------------- | :----------------------------------------- | :------- |
| `POST` | `/api/v1/user/register`        | Register a new user.                       | Public   |
| `POST` | `/api/v1/user/login`           | Log in an existing user, returns a cookie. | Public   |
| `GET`  | `/api/v1/user/logout`          | Log out the current user, clears cookie.   | Public   |
| `GET`  | `/api/v1/user/profile`         | Get the profile of the logged-in user.     | Private  |
| `POST` | `/api/v1/job/post`             | Post a new job.                            | Private  |
| `GET`  | `/api/v1/job/get`              | Get all jobs with dynamic filtering.       | Public   |
| `GET`  | `/api/v1/job/get/:id`          | Get details for a single job.              | Public   |
| `POST` | `/api/v1/company/register`     | Register a new company.                    | Private  |
| `GET`  | `/api/v1/company/get`          | Get all registered companies.              | Private  |
| `POST` | `/api/v1/application/apply/:id`| Apply to a job with the specified ID.      | Private  |

---

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Node.js installed (v18 or later recommended)
- MongoDB (local instance or a cloud URI from MongoDB Atlas)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Aytida-max/job-portal-backend.git](https://github.com/Aytida-max/job-portal-backend.git)
    cd job-portal-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables.

    ```env
    # .env.example

    # Your MongoDB connection string
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/your-database

    # Port for the server to run on
    PORT=5011

    # Secret key for signing JWTs
    JWT_SECRET=your_super_secret_key

    # The URL of your deployed frontend (for CORS)
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server should now be running on the port you specified in your `.env` file (e.g., `http://localhost:5011`).

---
