import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js"; // Ensure this utility is correct
import cloudinary from "../utils/cloud.js";   // Your Cloudinary config

const JWT_SECRET = process.env.JWT_SECRET;

// --- register, login, logout functions (assuming they are mostly okay, but see note on register) ---

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Missing required fields.",
                success: false,
            });
        }
        
        

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists.",
                success: false,
            });
        }

        const existingPhoneNumber = await User.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(409).json({
                message: "Phone number already exists.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {} // Initialize profile object
        });

        // NOTE FOR REGISTER: Since your /register route also uses singleUpload,
        // you might want to handle req.file here as well if users can upload a
        // profile picture during registration.
        if (req.file) {
            const uploadedFile = req.file;
            const fileUri = getDataUri(uploadedFile);
            if (fileUri && fileUri.content) {
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
                        folder: "profile_pictures", // Optional: organize
                    });
                    newUser.profile.profilePhoto = cloudinaryResponse.secure_url;
                    // newUser.profile.profilePhotoPublicId = cloudinaryResponse.public_id; // Optional
                } catch (uploadError) {
                    console.error("Cloudinary Upload Error during registration:", uploadError);
                    // Decide how to handle: proceed without image, or return error
                }
            }
        }

        await newUser.save();

        const userResponse = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            profile: newUser.profile, // Send profile back
        };

        return res.status(201).json({
            message: `Account created successfully for ${newUser.fullname}.`,
            success: true,
            user: userResponse,
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({
            message: "Server error during registration.",
            success: false,
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Missing required fields: email, password, and role.",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (user.role !== role) {
            return res.status(403).json({
                message: `Login failed. Role mismatch. You are trying to log in as ${role}, but your account is registered as ${user.role}.`,
                success: false,
            });
        }

        const tokenData = { userId: user._id };
        // jwt.sign is synchronous, no await needed unless using a callback
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "1d" });

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile || {},
        };

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            
            sameSite: "Lax",
        }).json({
            message: `Welcome back, ${user.fullname}!`,
            user: userResponse,
            success: true,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: "Server error during login.",
            success: false,
        });
    }
};



export const getMyProfile = async (req, res) => {
    try {
        // req.id is provided by your authentication middleware after it verifies the token
        const userId = req.id;

        // Find the user by their ID and exclude the password field for security
        const user = await User.findById(userId).select('-password');

        // Safety check in case the user does not exist in the database
        if (!user) {
            return res.status(404).json({ 
                message: "User not found.", 
                success: false 
            });
        }

        // Send a success response with the user's data
        return res.status(200).json({
            user,
            success: true
        });

    } catch (error) {
        console.log("Error in getMyProfile controller: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};



export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: "strict",
        }).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({
            message: "Server error during logout.",
            success: false,
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id;

        // No update data check (can be more nuanced now with separate files)
        const hasTextUpdates = fullname || email || phoneNumber || (typeof bio === 'string') || (typeof skills === 'string');
        const hasFileUpdates = req.files && (req.files.profilePhoto || req.files.resume);

        if (!hasTextUpdates && !hasFileUpdates) {
            return res.status(400).json({
                message: "No update information provided.",
                success: false,
            });
        }

        let user = await User.findById(userId);
        if (!user) { /* ... user not found ... */ }
        if (!user.profile) { user.profile = {}; }

        // Handle Profile Photo Upload
        if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
            const profilePhotoFile = req.files.profilePhoto[0];
            if (!profilePhotoFile.mimetype.startsWith('image/')) {
                 return res.status(400).json({ message: "Profile photo must be an image.", success: false });
            }
            const fileUri = getDataUri(profilePhotoFile);
            if (fileUri && fileUri.content) {
                const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "profile_pictures",
                });
                user.profile.profilePhoto = cloudinaryResponse.secure_url;
                if (user.profile.profilePhotoPublicId) { // If you store public_id for deletion
                    await cloudinary.uploader.destroy(user.profile.profilePhotoPublicId);
                }
                user.profile.profilePhotoPublicId = cloudinaryResponse.public_id; // Store new public_id
            }
        }

        // Handle Resume Upload
        if (req.files && req.files.resume && req.files.resume[0]) {
            const resumeFile = req.files.resume[0];
            if (resumeFile.mimetype !== 'application/pdf') {
                 return res.status(400).json({ message: "Resume must be a PDF.", success: false });
            }
            const fileUri = getDataUri(resumeFile);
            if (fileUri && fileUri.content) {
                const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: "resumes",
                    resource_type: "raw", // Or 'auto' - for non-image files, 'raw' or 'auto' is better
                });
                user.profile.resume = cloudinaryResponse.secure_url;
                user.profile.resumeOriginalName = resumeFile.originalname; // Store original name
                if (user.profile.resumePublicId) { // If you store public_id for deletion
                    await cloudinary.uploader.destroy(user.profile.resumePublicId, { resource_type: "raw" });
                }
                user.profile.resumePublicId = cloudinaryResponse.public_id; // Store new public_id
            }
        }

        // Update text fields (same as before)
        if (fullname) user.fullname = fullname;
        // ... (email, phoneNumber, bio updates with validation) ...
        if (email && email !== user.email) { /* ... */ }
        if (phoneNumber && phoneNumber !== user.phoneNumber) { /* ... */ }
        if (typeof bio === 'string') user.profile.bio = bio;


        if (typeof skills === 'string') { // Skills from frontend is now a string
            user.profile.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        }

        await user.save();

        const userResponse = { 
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: { // Explicitly construct the profile object if needed
                bio: user.profile?.bio,
                skills: user.profile?.skills, // Should be an array
                profilePhoto: user.profile?.profilePhoto, // Should be a URL
                resume: user.profile?.resume, // Should be a URL
                resumeOriginalName: user.profile?.resumeOriginalName,
                // Ensure all other necessary profile fields are included
            },
            // Include any other top-level fields your frontend needs
        };
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: userResponse, // Make sure this userResponse contains the NEW URLs
            success: true,
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        // ... (error handling) ...
        res.status(500).json({ message: "Server error updating profile.", error: error.message, success: false });
    }
};