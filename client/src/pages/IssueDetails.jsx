import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const IssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);

    const [commentText, setCommentText] = useState("");

    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [error, setError] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        const fetchIssue = async () => {
            try {
                setLoading(true);

                const [issueResponse, commentsResponse] =
                    await Promise.all([
                        api.get(`/issues/${id}`),
                        api.get(`/issues/${id}/comments`)
                    ]);

                setIssue(issueResponse.data.issue);
                setComments(commentsResponse.data.comments);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load issue"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIssue();
    }, [id]);

    const handleDeleteIssue = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this issue? This will also delete its comments."
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(true);

            await api.delete(`/issues/${id}`);

            navigate("/issues");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete issue"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        try {
            setCommentLoading(true);

            const response = await api.post(
                `/issues/${id}/comments`,
                {
                    content: commentText
                }
            );

            setComments((prev) => [
                ...prev,
                response.data.comment
            ]);

            setCommentText("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add comment"
            );
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(
                `/comments/${commentId}`
            );

            setComments((prev) =>
                prev.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="dashboard-container">
                    Loading issue...
                </main>
            </>
        );
    }

    if (error || !issue) {
        return (
            <>
                <Navbar />

                <main className="dashboard-container">
                    <p className="error">
                        {error || "Issue not found"}
                    </p>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="issue-details-container">

                <button
                    className="back-button"
                    onClick={() => navigate("/issues")}
                >
                    ← Back to Issues
                </button>

                <div className="issue-details-card">

                    <div className="issue-details-header">

                        <div>
                            <h1>{issue.title}</h1>

                            <div className="issue-labels">
                                <span
                                    className={`status-badge ${issue.status
                                        .toLowerCase()
                                        .replace(" ", "-")}`}
                                >
                                    {issue.status}
                                </span>

                                <span
                                    className={`priority-badge ${issue.priority.toLowerCase()}`}
                                >
                                    {issue.priority}
                                </span>

                                <button
                                    className="delete-issue-button"
                                    onClick={handleDeleteIssue}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? "Deleting..." : "Delete Issue"}
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="issue-description">

                        <h3>Description</h3>

                        <p>
                            {issue.description}
                        </p>

                    </div>

                    <div className="issue-information">

                        <div>
                            <strong>Created by</strong>

                            <span>
                                {issue.createdBy?.name ||
                                    "Unknown"}
                            </span>
                        </div>

                        <div>
                            <strong>Assigned to</strong>

                            <span>
                                {issue.assignedTo?.name ||
                                    "Unassigned"}
                            </span>
                        </div>

                        <div>
                            <strong>Created</strong>

                            <span>
                                {new Date(
                                    issue.createdAt
                                ).toLocaleDateString()}
                            </span>
                        </div>

                    </div>

                </div>

                <div className="comments-card">

                    <h2>
                        Comments ({comments.length})
                    </h2>

                    <div className="comments-list">

                        {comments.length === 0 ? (
                            <p className="no-comments">
                                No comments yet.
                            </p>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    className="comment"
                                    key={comment._id}
                                >

                                    <div className="comment-header">

                                        <strong>
                                            {comment.author?.name ||
                                                "Unknown"}
                                        </strong>

                                        <small>
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleString()}
                                        </small>

                                    </div>

                                    <p>
                                        {comment.content}
                                    </p>

                                    <button
                                        className="delete-comment-button"
                                        onClick={() =>
                                            handleDeleteComment(
                                                comment._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            ))
                        )}

                    </div>

                    <form
                        className="comment-form"
                        onSubmit={handleAddComment}
                    >

                        <textarea
                            value={commentText}
                            onChange={(e) =>
                                setCommentText(
                                    e.target.value
                                )
                            }
                            placeholder="Write a comment..."
                            rows="4"
                        />

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={commentLoading}
                        >
                            {commentLoading
                                ? "Adding..."
                                : "Add Comment"}
                        </button>

                    </form>

                </div>

            </main>
        </>
    );
};

export default IssueDetails;