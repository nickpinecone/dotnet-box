import mongoose, { Schema } from "mongoose";

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

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "achievement"
    }],
});

const Portfolio = mongoose.model("portfolio", PortfolioSchema);

export default Portfolio;