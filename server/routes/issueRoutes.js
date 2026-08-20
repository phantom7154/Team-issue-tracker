const express = require("express");

const {
    createIssue,
    getIssues,
    getIssue,
    updateIssue,
    deleteIssue
} = require("../controllers/issueController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createIssue);
router.get("/", getIssues);
router.get("/:id", getIssue);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

module.exports = router;