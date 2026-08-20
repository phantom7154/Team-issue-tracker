const Issue = require("../models/Issue");
const User = require("../models/User");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

const validStatuses = [
    "Open",
    "In Progress",
    "Resolved",
    "Closed"
];

const validPriorities = [
    "Low",
    "Medium",
    "High",
    "Critical"
];

const createIssue = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            assignedTo
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        if (assignedTo) {
            const user = await User.findById(assignedTo);

            if (!user) {
                return res.status(400).json({
                    message: "Assigned user not found"
                });
            }
        }

        const issue = await Issue.create({
            title,
            description,
            priority,
            assignedTo: assignedTo || null,
            createdBy: req.user.id
        });

        const populatedIssue = await issue.populate([
            {
                path: "createdBy",
                select: "name email"
            },
            {
                path: "assignedTo",
                select: "name email"
            }
        ]);

        res.status(201).json({
            message: "Issue created successfully",
            issue: populatedIssue
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getIssues = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            assignedTo,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        // Search by title
        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        // Filter by priority
        if (priority) {
            filter.priority = priority;
        }

        // Filter by assignee
        if (assignedTo) {
            filter.assignedTo = assignedTo;
        }

        // Validate status
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        // Validate priority
        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid priority"
            });
        }

        // Validate assignedTo
        if (assignedTo) {
            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                return res.status(400).json({
                    message: "Invalid assignee ID"
                });
            }

            filter.assignedTo = assignedTo;
        }

        const pageNumber = Math.max(parseInt(page), 1);
        const limitNumber = Math.min(
            Math.max(parseInt(limit), 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;

        const [issues, totalIssues] = await Promise.all([
            Issue.find(filter)
                .populate("createdBy", "name email")
                .populate("assignedTo", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Issue.countDocuments(filter)
        ]);

        res.json({
            issues,
            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalIssues,
                totalPages: Math.ceil(
                    totalIssues / limitNumber
                )
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("assignedTo", "name email");

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        res.json({
            issue
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateIssue = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            assignedTo
        } = req.body;

        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (assignedTo !== undefined && assignedTo !== null) {
            const user = await User.findById(assignedTo);

            if (!user) {
                return res.status(400).json({
                    message: "Assigned user not found"
                });
            }
        }

        if (title !== undefined) {
            issue.title = title;
        }

        if (description !== undefined) {
            issue.description = description;
        }

        if (status !== undefined) {
            issue.status = status;
        }

        if (priority !== undefined) {
            issue.priority = priority;
        }

        if (assignedTo !== undefined) {
            issue.assignedTo = assignedTo;
        }

        await issue.save();

        const populatedIssue = await issue.populate([
            {
                path: "createdBy",
                select: "name email"
            },
            {
                path: "assignedTo",
                select: "name email"
            }
        ]);

        res.json({
            message: "Issue updated successfully",
            issue: populatedIssue
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({
                message: "Issue not found"
            });
        }

        if (issue.createdBy.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete issues you created"
            });
        }

        await Comment.deleteMany({
            issue: issue._id
        });

        await issue.deleteOne();

        res.json({
            message: "Issue deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getIssue,
    updateIssue,
    deleteIssue
};