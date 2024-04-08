import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio",
    },

    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }],
});

const User = mongoose.model("user", UserSchema);

export default User;