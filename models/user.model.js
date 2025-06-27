import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Student', 'Recruiter'],
        default: 'Student',
        required: true,
    },
    profile: { // Added colon here
        bio: { // Added colon here
            type: String
        },
        skills: [{
            type: String
        }],
        resume: {
            type: String // URL or path to the resume file
        },
        resumeOriginalName: { // Corrected capitalization and added colon
            type: String // Original name of the uploaded resume file
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
        },
        profilePhoto: {
            type: String, // URL or path to the profile photo
            default: "",
        },
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
// import mongoose from "mongoose";
// const userSchema = new mongoose.Schema({
//     fullname: {
//         type: String,
//         required: true,
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true,
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required:true,
//     },
//     role: {
//         type: String,
//         enum:['Student','Recruiter'],
//         default:'Student',
//         required:true,
//     },
//     profile{
//         bio{
//             type:String
//         }
//         skills:[{
//             type:String
//         }],
//         resume:{
//             type:String
//         },
//         resumeOriginalname:{
//             type:string
//         },
//         company:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"Company",
//         }
//         profilePhoto:{
//             type: string,
//             default:"",
//         },
//     },
// },{timestamps:true});

// export const User = mongoose.model("User", userSchema);
