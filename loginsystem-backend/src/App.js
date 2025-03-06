import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Members from "./components/Members";
import EditMember from "./components/EditMember";
import AddMember from "./components/AddMember";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/edit-member/:id" element={<EditMember />} />
            <Route path="/add-member" element={<AddMember />} />
        </Routes>
    );
}

export default App;
