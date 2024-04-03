import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
    url: String,
    description: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const CertificateSchema = new Schema({
    photo: String,
    description: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const PortfolioSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    description: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    projects: [ProjectSchema],
    certificates: [CertificateSchema],
});

const Portfolio = mongoose.model("portfolio", PortfolioSchema);

export default Portfolio;