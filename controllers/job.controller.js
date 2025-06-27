


import { Job } from "../models/job.model.js"; // Ensure this path is correct

//Admin job posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements, // This will be treated as a single string from req.body
      salary,
      location,
      jobType,
      experience,   // This is the experience value from req.body
      position,
      companyId,
    } = req.body;

    const userId = req.id; // Assuming this is correctly set by your authentication middleware

    // Consolidating the check for all required fields
    if (
      !title ||
      !description ||
      !requirements || // If requirements is an empty string, this will pass. Consider if empty string is valid.
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required.", // Simplified message
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements, // Pass the string directly, assuming schema is type: String
      salary: Number(salary),     // Good to ensure salary is a number
      location,
      jobType,
      experience: experience,     // Corrected: schema field is likely 'experience'
      position,
      company: companyId,         // Assuming schema field is 'company' and expects an ObjectId
      created_by: userId,       // Assuming schema field is 'created_by' and expects an ObjectId
    });

    res.status(201).json({
      message: "Job posted successfully.",
      job,
      success: true, // Changed 'status' to 'success' for consistency if that's your pattern
    });

  } catch (error) {
    console.error("Error in postJob:", error); // Log the actual error for debugging
    return res.status(500).json({
      message: "Server Error during job posting.", // More specific error message
      success: false, // Changed 'status' to 'success'
    });
  }
};



//Users
// export const getAllJobs = async (req, res) => {
//   try {
//     const keyword = req.query.keyword || "";
//     const query = {
//       $or: [
//         { title: { $regex: keyword, $options: "i" } },
//         { description: { $regex: keyword, $options: "i" } },
//       ],
//     };
//     const jobs = await Job.find(query)
//       .populate({
//         path: "company",
//       })
//       .sort({ createdAt: -1 });

//     if (!jobs) {
//       return res.status(404).json({ message: "No jobs found", status: false });
//     }
//     return res.status(200).json({ jobs, status: true });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error", status: false });
//   }
// };




// In your backend job.controller.js



export const getAllJobs = async (req, res) => {
    try {
        // 1. Get all possible parameters from the URL query
        const { keyword, location, jobType, experience, salary } = req.query;

        // 2. Start with an empty query object
        const query = {};

        // 3. Add your keyword search logic if a keyword exists
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }

        // 4. Conditionally add the other filters to the same query object
        if (location) {
            query.location = location;
        }

        if (jobType) {
            query.jobType = jobType;
        }

        // Add logic for experience range (e.g., "3-5")
        if (experience) {
            const expRange = experience.split('-').map(Number);
            if (expRange.length === 2) {
                query.experience = { $gte: expRange[0], $lte: expRange[1] };
            }
        }

        // Add logic for salary range (e.g., "10-20")
        if (salary) {
            const salaryRange = salary.split('-').map(Number);
            if (salaryRange.length === 2) {
                query.salary = { $gte: salaryRange[0], $lte: salaryRange[1] };
            }
        }
        
        // 5. Execute the final, combined query
        const jobs = await Job.find(query).populate('company').sort({ createdAt: -1 });
        
        // Your response logic is good
        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                message: "No jobs found matching your criteria.",
                jobs: [],
                success: true,
            });
        }
        
        return res.status(200).json({
            message: "Jobs retrieved successfully.",
            jobs,
            success: true,
        });

    } catch (error) {
        console.error("Error in getAllJobs:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

//Users
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }
    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Admin job created

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate('company') 
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};