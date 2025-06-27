// File: Backend/routes/user.routes.js
import express from 'express';
import { register, login, updateProfile, logout, getMyProfile } from '../controllers/user.controller.js';
import authenticateToken from '../middleware/isAuthenticated.js';

// Option 1: If 'singleUpload' is still defined and exported in multer.js for the register route
import { singleUpload, profileUpdateUpload } from '../middleware/multer.js';
// Option 2: If 'singleUpload' was REMOVED from multer.js, only import profileUpdateUpload
// import { profileUpdateUpload } from '../middleware/multer.js';


const router = express.Router();

// Route for user registration
// IF 'singleUpload' is still defined in and exported from multer.js for this purpose:
router.route("/register").post(singleUpload, register);
// ELSE IF register does NOT upload a file, or if 'singleUpload' is gone:
// router.route("/register").post(register);


// Route for user login
router.route("/login").post(login);
router.route("/logout").post(logout);
router.get("/profile", authenticateToken, getMyProfile);

// Route for updating user profile
router.route("/profile/update").post(
    authenticateToken,
    profileUpdateUpload, // <--- Use the new middleware for multiple fields here
    updateProfile
);

export default router;