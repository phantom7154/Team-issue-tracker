const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 1000
        },

        issue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue",
            required: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

commentSchema.index({ issue: 1 });

module.exports = mongoose.model("Comment", commentSchema);