const Issue = require("../models/Issue");

const formatCounts = (counts) => {
    return counts.reduce((result, item) => {
        result[item._id] = item.count;
        return result;
    }, {});
};

const getDashboardStats = async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();

        const statusCounts = await Issue.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityCounts = await Issue.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const workload = await Issue.aggregate([
            {
                $match: {
                    assignedTo: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$assignedTo",

                    issueCount: {
                        $sum: 1
                    },

                    activeIssues: {
                        $sum: {
                            $cond: [
                                {
                                    $in: [
                                        "$status",
                                        ["Open", "In Progress"]
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    user: "$user.name",
                    issueCount: 1,
                    activeIssues: 1
                }
            },
            {
                $sort: {
                    issueCount: -1
                }
            }
        ]);

        res.json({
            totalIssues,
            statusCounts: formatCounts(statusCounts),
            priorityCounts: formatCounts(priorityCounts),
            workload
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getDashboardStats
};