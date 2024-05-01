import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    content: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Comment = mongoose.model("comment", CommentSchema);

CommentSchema.pre("save", function (next) {
    // @ts-expect-error somehow mongoose formats the date number
    this.updatedAt = Date.now();

    return next();
});

export default Comment;