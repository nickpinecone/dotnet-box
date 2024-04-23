import mongoose, { CallbackError, Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    name: String,
    surname: String,
    paternalName: String,

    userTag: String,
    phoneNumber: String,
    socials: [String],
    bio: String,

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
});

UserSchema.pre("save", async function (next) {
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