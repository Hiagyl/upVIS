import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, UserPlus } from "lucide-react";

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        // simulate API request
        setTimeout(() => {
            console.log(form);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6">

            {/* Register Card */}
            <div className="w-full max-w-md bg-white border-2 border-amber-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-10">

                {/* Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-amber-100 text-amber-700 rounded-xl mb-4">
                        <Sun size={32} />
                    </div>

                    <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">
                        Sign up 
                    </h1>

                    <p className="text-slate-500 mt-2 font-medium">
                        Welcome. Register to access UPVis.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            Full Name
                        </label>

                        <input
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-amber-500 outline-none"
                            placeholder="Juan Dela Cruz"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            Email Address
                        </label>

                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
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
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-amber-500 outline-none"
                            placeholder="Enter password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                            Confirm Password
                        </label>

                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-amber-500 outline-none"
                            placeholder="Confirm password"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl text-lg font-black hover:bg-amber-600 transition-all shadow-lg active:scale-95 disabled:bg-slate-300"
                    >
                        {loading ? (
                            <>
                                <Sun className="animate-spin" size={20} />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                Register
                            </>
                        )}
                    </button>

                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-500 font-medium">
                    Already have an account?{" "}
                   <Link
                        to="/login"
                        className="text-amber-600 font-bold hover:underline"
                        >
                        Sign In
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;