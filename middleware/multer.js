// File: Backend/middleware/multer.js
import multer from "multer";

// Common storage strategy (files stored in memory as Buffers)
const storage = multer.memoryStorage();

/**
 * Middleware for handling a single file upload.
 * Expects the file to be in a field named "file".
 * Used for routes like /register if it involves a single file (e.g., initial profile pic).
 */
export const singleUpload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Example: 5MB limit for single uploads
    fileFilter: (req, file, cb) => {
        // Optional: Add a generic file filter or specific for the "file" field if needed
        // For example, if it's always an image for register:
        // if (file.mimetype.startsWith('image/')) {
        //     cb(null, true);
        // } else {
        //     cb(new Error('Only image files are allowed for this upload.'), false);
        // }
        // For now, allowing any file type for the generic singleUpload:
        cb(null, true);
    }
}).single("file");

/**
 * Middleware for handling multiple, named file fields for profile updates.
 * Expects 'profilePhoto' (image) and 'resume' (PDF).
 */
export const profileUpdateUpload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Example: 10MB limit per file
    fileFilter: (req, file, cb) => {
        // This fileFilter will apply to *both* fields ('profilePhoto' and 'resume').
        // More specific validation per field should be done in the controller
        // if this generic filter isn't sufficient or if types are strictly different.
        // For instance, if 'profilePhoto' must be an image and 'resume' must be a PDF.
        // A simple approach is to allow common types here and validate strictly in controller.
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images and PDFs are allowed for profile fields.'), false);
        }
    }
}).fields([
    { name: 'profilePhoto', maxCount: 1 }, // For the profile picture
    { name: 'resume', maxCount: 1 }       // For the resume PDF
]);

// Note on file filters for .fields():
// The fileFilter in multer({ ... }).fields([...]) applies to ALL fields.
// If you need different strict type validation for 'profilePhoto' vs 'resume' AT THE MIDDLEWARE LEVEL,
// it gets more complex. A common pattern is to do basic filtering here (or none)
// and perform more specific mimetype checks within your controller after multer has processed the files.
// The example above allows images OR PDFs for any field processed by profileUpdateUpload.
// Your controller for `updateProfile` should then specifically check:
// - req.files.profilePhoto[0].mimetype starts with 'image/'
// - req.files.resume[0].mimetype is 'application/pdf'