import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { Sun, UserPlus, ChevronLeft } from "lucide-react";
import logo from "../assets/logo.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        fullname: form.name,
        email: form.email,
        password: form.password,
        contactNo: form.contactNo,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[52%] h-full bg-slate-900 flex-col justify-between p-14 relative overflow-hidden shrink-0">

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Rings */}
        <div className="absolute -top-32 -left-32 w-[440px] h-[440px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -top-16 -left-16 w-[280px] h-[280px] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] rounded-full border border-amber-500/15 pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[360px] h-[360px] rounded-full border border-amber-500/10 pointer-events-none" />
        <div className="absolute -bottom-48 -right-48 w-[640px] h-[640px] rounded-full border border-amber-500/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/5 pointer-events-none" />

        {/* Wordmark */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="UPVIS" className="w-9 h-9 object-contain brightness-0 invert opacity-90" />
          <span className="text-white/80 font-black tracking-[0.2em] text-sm uppercase">UPVIS</span>
        </div>

        {/* Headline */}
        <div className="relative z-10 max-w-sm">
          <div className="flex gap-1.5 mb-8">
            <span className="w-8 h-0.5 bg-amber-500 rounded-full" />
            <span className="w-2 h-0.5 bg-amber-400/50 rounded-full" />
          </div>
          <h2 className="text-white text-5xl font-serif font-black leading-[1.15] tracking-tight mb-6">
            Join the<br />network.<br />
            <span className="text-amber-400">Make a<br />difference.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            We don't want her/him to give up, to slip through the cracks. So we extend our hands out to as many as we can afford to help. 
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs tracking-[0.15em] uppercase font-semibold">
            UPV VIRGILS Integrated System
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 h-full bg-[#FAF9F6] flex flex-col relative overflow-hidden">

        {/* Amber corner fill */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-50 rounded-bl-full pointer-events-none" />

        {/* Ring accents */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-amber-200/60 pointer-events-none" />
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-amber-100 pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full border border-slate-200 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-slate-100 pointer-events-none" />

        {/* Back button */}
        <div className="relative z-10 p-6 shrink-0">
          <button
            onClick={() => navigate(-2)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-semibold transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        </div>

        {/* Scrollable form */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-8 overflow-y-auto">
          <div className="w-full max-w-[400px] py-6">

            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-10 lg:hidden">
              <img src={logo} alt="UPVIS" className="w-9 h-9 object-contain" />
              <span className="font-black tracking-widest text-sm uppercase text-slate-900">UPVIS</span>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <p className="text-amber-600 text-xs font-bold uppercase tracking-[0.18em] mb-3">New here?</p>
              <h1 className="text-4xl font-serif font-black text-slate-900 leading-tight tracking-tight">
                Create your<br />account
              </h1>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                <input
                  name="name" type="text" required value={form.name} onChange={handleChange}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-300 focus:border-amber-500 focus:outline-none bg-white transition-colors"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  name="email" type="email" required value={form.email} onChange={handleChange}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-300 focus:border-amber-500 focus:outline-none bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contact Number</label>
                <input
                  name="contactNo" type="text" required value={form.contactNo} onChange={handleChange}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-300 focus:border-amber-500 focus:outline-none bg-white transition-colors"
                  placeholder="+63 9XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <input
                  name="password" type="password" required value={form.password} onChange={handleChange}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-300 focus:border-amber-500 focus:outline-none bg-white transition-colors"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
                <input
                  name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-300 focus:border-amber-500 focus:outline-none bg-white transition-colors"
                  placeholder="Repeat your password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-xl text-base font-black hover:bg-amber-600 transition-all duration-200 shadow-lg active:scale-95 disabled:bg-slate-300"
                >
                  {loading ? (
                    <><Sun className="animate-spin" size={18} />Creating Account...</>
                  ) : (
                    <><UserPlus size={18} />Create Account</>
                  )}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <p className="text-center text-slate-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 font-bold hover:text-amber-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;