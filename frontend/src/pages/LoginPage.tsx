import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, LogIn } from "lucide-react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // simulate login request
        setTimeout(() => {
            setLoading(false);
            console.log({ email, password });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6">

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border-2 border-amber-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-10">

                {/* Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-amber-100 text-amber-700 rounded-xl mb-4">
                        <Sun size={32} />
                    </div>

                    <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">
                        Sign in
                    </h1>

                    <p className="text-slate-500 mt-2 font-medium">
                        Welcome back. Log in to access UPVis.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-amber-500 outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-amber-500 outline-none"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl text-lg font-black hover:bg-amber-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
                    >
                        {loading ? (
                            <>
                                <Sun className="animate-spin" size={20} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>

                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-500 font-medium">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-amber-600 font-bold hover:underline"
                        >
                        Sign Up
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;