import LogoutButton from "../components/shared/LogoutButton";

const LogoutTestPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
            <div className="bg-white p-10 rounded-2xl border-2 border-amber-100 shadow-sm flex flex-col items-center gap-6">
                <h1 className="text-2xl font-serif font-black text-slate-900">
                    Logout Test Page
                </h1>
                <LogoutButton />
            </div>
        </div>
    );
};

export default LogoutTestPage;