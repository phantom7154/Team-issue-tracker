const Comment = require("../models/Comment");
const Issue = require("../models/Issue");
const mongoose = require("mongoose");

const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { issueId } = req.params;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Comment is empty"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const comment = await Comment.create({
            content,
            issue: issueId,
            author: req.user.id
        });

        const populatedComment = await comment.populate(
            "author",
            "name email"
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getComments = async (req, res) => {
    try {
        const { issueId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        const comments = await Comment.find({
            issue: issueId
        })
            .populate("author", "name email")
            .sort({ createdAt: 1 });

        res.json({
            count: comments.length,
            comments
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                message: "Invalid comment ID"
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        const isAuthor =
            comment.author.toString() === req.user.id.toString();

        const isAdmin = req.user.role === "admin";

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                message: "You are not allowed to delete this comment"
            });
        }

        await comment.deleteOne();

        res.json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createComment,
    getComments,
    deleteComment
};