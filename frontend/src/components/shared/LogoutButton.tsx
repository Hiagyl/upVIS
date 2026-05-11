import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await authService.logout();

            window.location.href = "/";
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-700 border-2 border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all font-bold disabled:opacity-50"
        >
            <LogOut size={18} />
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;