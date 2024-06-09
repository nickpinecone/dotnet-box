import mongoose, { CallbackError, Schema } from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import fs from "node:fs/promises";

const UserSchema = new Schema({
    name: String,
    surname: String,
    paternalName: String,

    vkId: String,
    phoneNumber: String,
    socials: [String],
    bio: String,

    _oldAvatar: String,
    avatar: {
        type: String,
        set: function (value: string) {
            //@ts-expect-error defined on schema
            this._oldAvatar = this.avatar;
            return value;
        }
    },

    password: String,
    email: String,
    verified: { type: Boolean, default: false },

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio",
    },

    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],

    liked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "achievement",
    }],
});

UserSchema.pre("save", async function (next) {
    if (this.avatar && this.isModified("avatar") && this._oldAvatar) {
        const photoName = path.resolve(__dirname, "..", "public/photos/" + this._oldAvatar);

        try {
            await fs.unlink(photoName);
        }
        catch (err) {
            console.error(err);
        }
    }

    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        if (this.password)
            this.password = await bcrypt.hash(this.password, salt);

        return next();
    }
    catch (error) {
        return next(error as CallbackError);
    }
});

const User = mongoose.model("user", UserSchema);

export default User;