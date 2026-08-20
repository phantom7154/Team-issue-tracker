import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import IssueForm from "../components/IssueForm";

const Issues = () => {
    const navigate = useNavigate();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [page, setPage] = useState(1);

    const [showForm, setShowForm] = useState(false);
    const [editingIssue, setEditingIssue] = useState(null);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalIssues: 0
    });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {
                    page,
                    limit: 5
                };

                if (search.trim()) {
                    params.search = search.trim();
                }

                if (status) {
                    params.status = status;
                }

                if (priority) {
                    params.priority = priority;
                }

                const response = await api.get("/issues", {
                    params
                });

                setIssues(response.data.issues);
                setPagination(response.data.pagination);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load issues"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, [page, status, priority, search, refreshKey]);

    const handleSearch = (e) => {
        e.preventDefault();

        setPage(1);
        setSearch(searchInput);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
        setPage(1);
    };

   const handleIssueSuccess = () => {
        setShowForm(false);
        setEditingIssue(null);

        setRefreshKey((prev) => prev + 1);
    };

    return (
        <>
            <Navbar />

            <main className="issues-container">

                <div className="issues-header">
                    <div>
                        <h1>Issues</h1>

                        <p>
                            Manage and track your team's issues.
                        </p>
                    </div>

                    <button
                        className="primary-button"
                        onClick={() => setShowForm(true)}
                    >
                        + New Issue
                    </button>
                </div>

                <div className="filters-card">

                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchInput}
                            onChange={(e) =>
                                setSearchInput(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="search-button"
                        >
                            Search
                        </button>
                    </form>

                    <div className="filter-row">

                        <select
                            value={status}
                            onChange={handleStatusChange}
                        >
                            <option value="">
                                All Statuses
                            </option>

                            <option value="Open">
                                Open
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Resolved">
                                Resolved
                            </option>

                            <option value="Closed">
                                Closed
                            </option>
                        </select>

                        <select
                            value={priority}
                            onChange={handlePriorityChange}
                        >
                            <option value="">
                                All Priorities
                            </option>

                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>

                            <option value="Critical">
                                Critical
                            </option>
                        </select>

                    </div>
                </div>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading issues...</p>
                    </div>
                ) : issues.length === 0 ? (
                    <div className="empty-state">
                        <h2>No issues found</h2>

                        <p>
                            Try changing your search or filters.
                        </p>
                    </div>
                ) : (
                    <div className="issues-list">

                        {issues.map((issue) => (
                            <div
                                className="issue-card"
                                key={issue._id}
                                onClick={() => navigate(`/issues/${issue._id}`)}
                            >
                                <div className="issue-main">

                                    <h2>
                                        {issue.title}
                                    </h2>

                                    <p>
                                        {issue.description}
                                    </p>

                                    <div className="issue-meta">

                                        <span>
                                            Created by:{" "}
                                            {issue.createdBy?.name ||
                                                "Unknown"}
                                        </span>

                                        <span>
                                            Assigned to:{" "}
                                            {issue.assignedTo?.name ||
                                                "Unassigned"}
                                        </span>

                                    </div>
                                </div>

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
                                        className="edit-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingIssue(issue);
                                        }}
                                    >
                                        Edit
                                    </button>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="pagination">

                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage((prev) => prev - 1)
                            }
                        >
                            ← Previous
                        </button>

                        <span>
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </span>

                        <button
                            disabled={
                                page === pagination.totalPages
                            }
                            onClick={() =>
                                setPage((prev) => prev + 1)
                            }
                        >
                            Next →
                        </button>

                    </div>
                )}

            </main>

            {(showForm || editingIssue) && (
                <IssueForm
                    issue={editingIssue}
                    onSuccess={handleIssueSuccess}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingIssue(null);
                    }}
                />
            )}
        </>
    );
};

export default Issues;