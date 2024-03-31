import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio",
    },
});

const User = mongoose.model("user", UserSchema);

export default User;