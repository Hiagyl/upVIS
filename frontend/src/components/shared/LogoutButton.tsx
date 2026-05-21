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
            className="group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border-2 border-transparent hover:bg-red-50 hover:border-red-200 transition-all duration-200 disabled:opacity-50"
        >
            <span className="text-slate-400 group-hover:text-red-500 transition-colors">
                <LogOut size={20} />
            </span>
            <span className="text-base font-semibold font-sans tracking-wide text-slate-600 group-hover:text-red-600 transition-colors">
                {loading ? "Logging out..." : "Logout"}
            </span>
        </button>
    );
};

export default LogoutButton;