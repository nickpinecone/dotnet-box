import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
    url: String,
    description: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio"
    },
});

const Project = mongoose.model("project", ProjectSchema);

export default Project;