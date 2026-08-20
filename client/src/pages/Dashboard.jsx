import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get(
                    "/dashboard/stats"
                );

                setStats(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="dashboard-container">
                    <p>Loading dashboard...</p>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <main className="dashboard-container">
                    <p className="error">
                        {error}
                    </p>
                </main>
            </>
        );
    }

    const statusCounts = stats.statusCounts || {};
    const priorityCounts = stats.priorityCounts || {};

    return (
        <>
            <Navbar />

            <main className="dashboard-container">

                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>

                        <p>
                            Here's what's happening
                            with your team's issues.
                        </p>
                    </div>
                </div>

                <section className="stats-grid">

                    <StatCard
                        title="Total Issues"
                        value={stats.totalIssues}
                    />

                    <StatCard
                        title="Open"
                        value={statusCounts["Open"] || 0}
                    />

                    <StatCard
                        title="In Progress"
                        value={
                            statusCounts["In Progress"] || 0
                        }
                    />

                    <StatCard
                        title="Resolved"
                        value={
                            statusCounts["Resolved"] || 0
                        }
                    />

                </section>

                <section className="dashboard-grid">

                    <div className="dashboard-card">

                        <h2>Issues by Priority</h2>

                        <div className="count-list">

                            <div>
                                <span>Low</span>
                                <strong>
                                    {priorityCounts["Low"] || 0}
                                </strong>
                            </div>

                            <div>
                                <span>Medium</span>
                                <strong>
                                    {priorityCounts["Medium"] || 0}
                                </strong>
                            </div>

                            <div>
                                <span>High</span>
                                <strong>
                                    {priorityCounts["High"] || 0}
                                </strong>
                            </div>

                            <div>
                                <span>Critical</span>
                                <strong>
                                    {priorityCounts["Critical"] || 0}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="dashboard-card">

                        <h2>Team Workload</h2>

                        <div className="workload-list">

                            {stats.workload.length === 0 ? (
                                <p>
                                    No assigned issues yet.
                                </p>
                            ) : (
                                stats.workload.map((member) => (
                                    <div
                                        className="workload-item"
                                        key={member.user}
                                    >
                                        <div className="workload-info">
                                            <span>
                                                {member.user}
                                            </span>

                                            <strong>
                                                {member.issueCount}
                                            </strong>
                                        </div>

                                        <div className="workload-bar">
                                            <div
                                                className="workload-progress"
                                                style={{
                                                    width: `${Math.min(
                                                        member.issueCount * 20,
                                                        100
                                                    )}%`
                                                }}
                                            />
                                        </div>

                                        <small>
                                            {member.activeIssues} active
                                        </small>
                                    </div>
                                ))
                            )}

                        </div>

                    </div>

                </section>

            </main>
        </>
    );
};

export default Dashboard;