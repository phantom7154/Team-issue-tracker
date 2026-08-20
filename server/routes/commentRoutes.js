const express = require("express");

const {
    createComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/issues/:issueId/comments", createComment);
router.get("/issues/:issueId/comments", getComments);
router.delete("/comments/:commentId", deleteComment);

module.exports = router;