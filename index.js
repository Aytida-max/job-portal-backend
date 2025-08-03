import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js"
import companyRoute from "./routes/company.routes.js"
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.routes.js";
dotenv.config({});
// index.js

console.log("--- In index.js ---");
console.log("Attempted to load .env file.");
console.log("Value of process.env.PORT:", process.env.PORT); // Check if PORT is loaded
console.log("Value of process.env.JWT_SECRET:", process.env.JWT_SECRET); // Check JWT_SECRET
console.log("--------------------");

// ... other imports ...
const app = express();



//middleware


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions={
    origin:["http://localhost:5173",
        "https://job-portal-frontend-delta-neon.vercel.app/"
    ],
    credentials: true,
}
app.use(cors(corsOptions));

const PORT= process.env.PORT || 5001;


//api's

app.use("/api/users", userRoute);
app.use("/api/company", companyRoute );
app.use("/api/job", jobRoute );
app.use("/api/application", applicationRoute );


app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.routes.js"; // Corrected import name if it was userRoute previously

// dotenv.config({}); // Loads .env file variables

// const app = express();

// // Middleware
// app.use(express.json()); // Parses incoming requests with JSON payloads
// app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
// app.use(cookieParser()); // Parses cookies attached to the client request object

// // CORS Configuration
// // IMPORTANT: Ensure the origin(s) listed here EXACTLY match your frontend URL(s)
// // For example, if your frontend runs on http://localhost:3000, add that.
// // The port 5121 and https you have might be specific to your setup.
// const corsOptions = {
//     origin: [
//         "https://localhost:5121", // As you had it. Verify this is your frontend URL.
//         "http://localhost:5121",  // In case your frontend is on HTTP for this port
//         "http://localhost:3000",  // Common frontend dev port (example)
//         "http://localhost:5011"   // The port you mentioned trying to access
//     ],
//     credentials: true, // Allows cookies to be sent with requests from frontend
// };
// app.use(cors(corsOptions));

// const PORT = process.env.PORT || 5001;

// // Default Root Route - This will solve the "Cannot GET /"
// app.get("/", (req, res) => {
//     res.status(200).send("<h1>Job Portal API is running!</h1><p>Welcome. Use API clients to interact with specific endpoints like /api/users/register.</p>");
// });

// // API routes
// app.use("/api/users", userRoute);

// // Start the server
// app.listen(PORT, () => {
//     connectDB(); // Connect to MongoDB
//     console.log(`Server is running on port ${PORT}`);
//     console.log(`Access the API at http://localhost:${PORT}`);
//     console.log(`Your user routes are available under http://localhost:${PORT}/api/users`);
// });