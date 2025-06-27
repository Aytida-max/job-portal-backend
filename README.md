# Job Portal - Backend API

This repository contains the backend server for a full-stack Job Portal application. It provides a robust RESTful API for user authentication, company management, job postings, and application processing.

This backend is designed to work with its corresponding **[React Frontend Repository](https://github.com/Aytida-max/job-portal-frontend)**. 


---

## Features

- **Secure Authentication:** User registration and login using JSON Web Tokens (JWT) with password hashing (`bcryptjs`). Sessions are managed with secure `httpOnly` cookies.
- **Role-Based Access Control:** Middleware protects routes, ensuring only authenticated admins/recruiters can post jobs or register companies.
- **Full CRUD for Jobs:** API endpoints to create, read, update, and delete job postings.
- **Full CRUD for Companies:** API endpoints to create, read, update, and manage company profiles.
- **Advanced Filtering & Searching:** A powerful `GET` endpoint for jobs that allows for dynamic filtering by keyword, location, job type, experience, and salary.
- **Data Population:** Efficiently sends related data (e.g., full company details are populated within job objects).
- **Application System:** Endpoints for users to apply for jobs and for admins to view applicants.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Token (jsonwebtoken), bcryptjs
- **Middleware:** cookie-parser, cors

---

## API Endpoints (RESTful Design)

Here is a summary of the main API routes available. The base path is `/api/v1`.

| Method | Endpoint                       | Description                                | Access   |
| :----- | :----------------------------- | :----------------------------------------- | :------- |
| `POST` | `/auth/register`               | Register a new user account.               | Public   |
| `POST` | `/auth/login`                  | Log in a user and create a session/token.  | Public   |
| `GET`  | `/auth/logout`                 | Log out the current user, clears cookie.   | Public   |
| `GET`  | `/users/me`                    | Get the profile of the logged-in user.     | Private  |
| `POST` | `/jobs`                        | Create a new job posting.                  | Private  |
| `GET`  | `/jobs`                        | Get a list of all jobs with filtering.     | Public   |
| `GET`  | `/jobs/:id`                    | Get a single job by its ID.                | Public   |
| `GET`  | `/admin/jobs`                  | Get all jobs posted by the current admin.  | Private  |
| `POST` | `/companies`                   | Register a new company.                    | Private  |
| `GET`  | `/companies`                   | Get a list of all companies.               | Private  |
| `GET`  | `/companies/:id`               | Get a single company by its ID.            | Private  |
| `POST` | `/jobs/:jobId/applications`    | Apply for a specific job.                  | Private  |
| `GET`  | `/jobs/:jobId/applicants`      | Get all applicants for a specific job.     | Private  |

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
    MONGO_URI=mongodb+srv://adi763638:sFU361nmo3nEJgMV@cluster0.a6w2nji.mongodb.net/

    # Port for the server to run on
    PORT=5011

    # Secret key for signing JWTs
    JWT_SECRET=aVerySecureRandomString123!@

    # The URL of your deployed frontend (for CORS)
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server should now be running on the port you specified in your `.env` file (e.g., `http://localhost:5011`).

---

## Author

- Aditya Chauhan - [https://github.com/Aytida-max](https://github.com/Aytida-max)
