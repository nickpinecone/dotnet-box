import mongoose, { Schema } from "mongoose";
import fs from "fs";
import path from "path";

const AchievementTypes = ["project", "certificate"];

const AchievementSchema = new Schema({
    type: String,
    title: String,
    shortDescription: String,
    fullDescription: String,
    url: String,

    _oldPhoto: String,
    photo: {
        type: String,
        set: function (value: string) {
            //@ts-expect-error defined on schema
            this._oldPhoto = this.photo;
            return value;
        }
    },

    files: [String],

    likeAmount: {
        type: Number,
        default: 0,
    },

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

    if (this.photo && this.isModified("photo") && this._oldPhoto) {
        const photoName = path.resolve(__dirname, "..", "public/photos/" + this._oldPhoto);
        fs.unlink(photoName, (err) => { if (err) console.error(err); });
    }

    if (
        this.type &&
        this.isModified("type") &&
        !AchievementTypes.includes(this.type)
    ) return next(new Error("wrong achievement type"));

    return next();
});

AchievementSchema.pre("deleteOne", async function (next) {
    const id: string = this.getQuery()["_id"];
    const achievement = await Achievement.findOne({ _id: id });
    if (achievement == null) return next(new Error("no achievement with id : " + id));

    if (achievement.photo) {
        const photoName = path.resolve(__dirname, "..", "public/photos/" + achievement.photo);
        fs.unlink(photoName, (err) => { if (err) console.error(err); });
    }

    return next();
});

const Achievement = mongoose.model("achievement", AchievementSchema);

export default Achievement;