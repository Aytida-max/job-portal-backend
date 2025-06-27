import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloud.js";
import getDataUri from "../utils/datauri.js";
export const registerCompany = async (req,res) =>{
    try{
        const { companyName,description } = req.body;
        if(!companyName){
            res.status(404).json({
                message:"Company name is required"
            });
        }

        if (!description) {
            // It's good practice to return here
            return res.status(400).json({ // Changed 404 to 400 for Bad Request
                message: "Company description is required",
                success: false,
            });
        }


        let company =  await Company.findOne({name: companyName});
        if(company){
            return res.status(400).json({message : "Company is alreasy registered"});
        }

        company =  await Company.create({
            name: companyName,
            description: description,
            userId : req.id,
        });
        return res.status(201).json({
            message: "Company  created successfully",
            company,
            success: true,
        });
    }catch(error){
        console.error(error);
    }
};

export const getAllCompanies = async(req,res)=>{
    try{
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(404).json({message:"No companies found"});
        }
        return res.status(200).json({
            companies,
            success:true
        });
    }catch(error){
        console.error(error);
    }
}


///get company by id



export const getCompanyById = async (req,res)=>{
    try{
        const companyId =  req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({message:"Company not found"});
        }
        return res.status(200).json({company, success:true});
    }catch(error){
        console.error(error);
    }
}


//update company detail

export const updateCompany  = async(req,res)=>{
    try {
        const { name,description,website,location } = req.body;
        const file = req.file;
        //cloudinary


        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
        const updateData = {name,description,website,location,logo};



        // const updateData = {name,description,website,location};
        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{
            new:true,
        });
        if(!company){
            return res.status(404).json({
                message:"Company not found",
            })
        }
        return res.status(200).json({
            message:"Company updated"
        })
    } catch (error) {
        console.error(error);
    }
}