import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <button onClick={() => navigate("/members")}>Manage Members</button>
        </div>
    );
};

export default Dashboard;
