import express from 'express';
// Correctly import all necessary controller functions and middleware
import {
    getAllCompanies,
    getCompanyById,
    registerCompany, // Assuming this is the intended function for company registration
    updateCompany
} from '../controllers/company.controller.js';

// Assuming this is the correct path and filename for your authentication middleware.
// Previously, it might have been named 'authenticateToken.js'. Please verify.
import authenticateToken from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

// Route for company registration
// Issue 1: You imported 'registerCompany' but used 'register'. Assuming 'registerCompany' is correct.
// Issue 2 (Conceptual): Does company registration require a user to be already authenticated?
// If so, 'authenticateToken' is correct. If anyone can register a company, it might not be needed here.
router.route("/register").post(authenticateToken, registerCompany); // Changed 'register' to 'registerCompany'

// Route to get all companies
// Comment seems to be a leftover from another file, can be removed.
router.route("/get").get(authenticateToken, getAllCompanies);

// Route to get a specific company by ID
// Issue 3: 'getAllCompanies' is likely a route handler, not middleware.
// If this route needs authentication, use 'authenticateToken'.
// If it's public, remove 'getAllCompanies' from here.
router.route("/get/:id").get(authenticateToken, getCompanyById); // Assuming protection is needed, replaced getAllCompanies with authenticateToken. If not, remove it.

// Route to update a company by ID
router.route("/update/:id").put(authenticateToken, singleUpload,    updateCompany);

export default router;









// import express from 'express';
// // Correctly import all necessary controller functions and middleware
// import { getAllCompanies, getCompanyById, registerCompany, updateCompany } from '../controllers/company.controller.js';
// import authenticateToken from '../middleware/isAuthenticated.js'; // Assuming this is the correct path for your middleware

// const router = express.Router(); // Corrected: Capital 'R' for Router

// // Route for user registration
// router.route("/register").post(authenticateToken,register);


// router.route("/get").get(authenticateToken,getAllCompanies); // 'login' controller function was missing from imports
// router.route("/get/:id").get(authenticateToken, getCompanyById);

// router.route("/update/:id").put(authenticateToken, updateCompany);

// export default router;