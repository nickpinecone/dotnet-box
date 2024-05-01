import express from "express";
import Comment from "../models/comment.model";
import User from "../models/user.model";
import auth from "../middlewares/auth.middleware";
import validation from "../middlewares/validate.middleware";
import { body } from "express-validator";
import Achievement from "../models/achievement.model";

const router = express.Router();

router.route("/achievement/:achievementId/comment").post(
    auth.verifyToken,
    body("content").notEmpty(),
    validation.validateForm,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const achievement = await Achievement.findOne({ _id: req.params.achievementId });
            if (!achievement) throw new Error("could not find achievement: " + req.params.achievementId);

            const comment = await Comment.create({ content: req.body.content });

            achievement.comments.push(comment._id);
            comment.author = user._id;

            await achievement.save();
            await comment.save();
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not comment: " + err);
        }
    }
);

router.route("/comment/:commentId").put(
    auth.verifyToken,
    body("content").notEmpty(),
    validation.validateForm,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const comment = await Comment.findOne({ _id: req.params.commentId, author: user._id });
            if (!comment) throw new Error("could not find comment with id: " + req.params.commentId);

            comment.content = req.body.content;

            await comment.save();
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not update comment: " + err);
        }
    }
);

router.route("/comment/:commentId").delete(
    auth.verifyToken,
    async (req, res) => {
        try {
            const userId = res.locals.userId;
            const user = await User.findOne({ _id: userId });
            if (!user) throw new Error("could not find user: " + userId);

            const comment = await Comment.deleteOne({ _id: req.params.commentId, author: user._id });
            if (!comment) throw new Error("could not find comment with id: " + req.params.commentId);
        }
        catch (err) {
            console.error(err);
            res.status(500).send("could not delete comment: " + err);
        }
    }
);

export default router;
