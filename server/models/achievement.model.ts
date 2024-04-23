import mongoose, { Schema } from "mongoose";

const AchievementSchema = new Schema({
    photo: String,
    description: String,
    url: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio"
    },
});

const Achievement = mongoose.model("achievement", AchievementSchema);

export default Achievement;