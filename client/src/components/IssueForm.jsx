import { useEffect, useState } from "react";
import api from "../services/api";

const IssueForm = ({ issue, onSuccess, onCancel }) => {
    const isEditing = Boolean(issue);

    const [formData, setFormData] = useState({
        title: issue?.title || "",
        description: issue?.description || "",
        priority: issue?.priority || "Medium",
        status: issue?.status || "Open",
        assignedTo: issue?.assignedTo?._id || ""
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users");

                setUsers(response.data.users || response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load users"
                );
            } finally {
                setUsersLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (isEditing) {
                await api.put(
                    `/issues/${issue._id}`,
                    formData
                );
            } else {
                await api.post(
                    "/issues",
                    formData
                );
            }

            onSuccess();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save issue"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="issue-form-card">

                <div className="form-header">
                    <h2>
                        {isEditing
                            ? "Edit Issue"
                            : "Create New Issue"}
                    </h2>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="close-button"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <label>
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter issue title"
                        required
                    />

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the issue"
                        rows="5"
                        required
                    />

                    <div className="form-row">

                        <div>
                            <label>
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
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

                        <div>
                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
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
                        </div>

                    </div>

                    <label>
                        Assign To
                    </label>

                    <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        disabled={usersLoading}
                    >
                        <option value="">
                            Unassigned
                        </option>

                        {users.map((user) => (
                            <option
                                key={user._id}
                                value={user._id}
                            >
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>

                    <div className="form-actions">

                        <button
                            type="button"
                            onClick={onCancel}
                            className="secondary-button"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Update Issue"
                                    : "Create Issue"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default IssueForm;