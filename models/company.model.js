import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    logo: { // This will typically store a URL to the logo image
        type: String,
    },
    userId: [{ // Defines userId as an array
        type: mongoose.Schema.Types.ObjectId, // Comma instead of semicolon
        ref: "User",
        required: true, // This makes the array itself required if you intend it so, or an empty array is allowed.
                       // If you mean each user ID in the array is intrinsically required, that's inherent to ObjectId.
                       // Often, an empty array is permissible, and this `required: true` would mean the field
                       // 'userId' must exist, even if it's an empty array. If the company MUST have at least one user,
                       // you might add a custom validator.
    }], // Array definition ends here
}, { // Schema options object starts here
    timestamps: true // Semicolon removed, correctly placed as a schema option
});

export const Company = mongoose.model("Company", companySchema);