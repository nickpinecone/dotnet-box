import mongoose, { Schema } from "mongoose";

const AchievementTypes = ["project", "certificate"];

const AchievementSchema = new Schema({
    type: String,
    title: String,
    photo: String,
    shortDescription: String,
    fullDescription: String,
    url: String,

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],

    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio"
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }],
});

AchievementSchema.pre("save", function (next) {
    // @ts-expect-error somehow mongoose formats the date number
    this.updatedAt = Date.now();

    if (
        this.type &&
        this.isModified("type") &&
        !AchievementTypes.includes(this.type)
    ) return next(new Error("wrong achievement type"));

    return next();
});

const Achievement = mongoose.model("achievement", AchievementSchema);

export default Achievement;