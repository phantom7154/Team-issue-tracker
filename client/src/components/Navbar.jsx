import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link
                to="/dashboard"
                className="navbar-brand"
            >
                Team Issue Tracker
            </Link>

            <div className="navbar-links">
                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/issues">
                    Issues
                </Link>
            </div>

            <div className="navbar-right">
                <span>{user?.name}</span>

                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;