import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
    url: String,
    description: String,
});

const CertificateSchema = new Schema({
    photoPath: String,
    description: String,
});

const PortfolioSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    projects: [ProjectSchema],
    certificates: [CertificateSchema],
});

const Portfolio = mongoose.model("portfolio", PortfolioSchema);

export default Portfolio;