import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 bg-[#FAF9F6]/80 backdrop-blur z-50 flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-serif font-black tracking-wide">
          UPVIS
        </h1>

        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <button onClick={() => scrollToSection("home")} className="hover:text-amber-600">Home</button>
          <button onClick={() => scrollToSection("about")} className="hover:text-amber-600">About</button>
          <button onClick={() => scrollToSection("help")} className="hover:text-amber-600">How to Help</button>
          <button onClick={() => scrollToSection("scholars")} className="hover:text-amber-600">Scholars</button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-amber-600">Contact</button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-600 hover:text-amber-600"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-amber-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-slate-900 transition shadow-md"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="px-10 py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-serif font-black leading-tight mb-6">
            Change a Life.
            <br />
            <span className="text-amber-600">Support an Iskolar.</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            UPVIS connects donors with UP Visayas students who need support.
            Every donation is transparent, tracked, and impactful.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-amber-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition"
            >
              Donate Now
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="border border-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Learn More
            </button>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            ✔ 100% Transparency • ✔ Verified Scholars • ✔ Real Impact
          </p>
        </div>

        <div className="relative">
          <div className="w-full h-[400px] bg-gradient-to-br from-amber-200 to-amber-500 rounded-3xl shadow-2xl"></div>
        </div>

      </section>

      {/* STATS */}
      <section className="relative max-w-7xl mx-auto -mt-[85px] z-10 px-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD 1 - ACTIVE SCHOLARS */}
          <div className="bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl px-6 py-4 shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
            <div className="text-2xl mb-2">👥</div>
            <h2 className="text-2xl font-extrabold text-slate-900">75</h2>
            <p className="text-sm text-slate-500 font-medium">
              Active Scholars
            </p>
            <div className="mt-4 h-1 w-10 bg-amber-500 rounded-full"></div>
          </div>

          {/* CARD 2 - DONATIONS */}
          <div className="bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl px-6 py-4 shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
            <div className="text-2xl mb-2">💰</div>
            <h2 className="text-2xl font-extrabold text-slate-900">₱250K+</h2>
            <p className="text-sm text-slate-500 font-medium">
              Donations Tracked
            </p>
            <div className="mt-4 h-1 w-10 bg-amber-500 rounded-full"></div>
          </div>

          {/* CARD 3 - TOTAL SCHOLARS */}
          <div className="bg-white/95 backdrop-blur-md border border-amber-100 rounded-2xl px-6 py-4 shadow-lg hover:shadow-2xl transition hover:-translate-y-1">
            <div className="text-2xl mb-2">🎓</div>
            <h2 className="text-2xl font-extrabold text-slate-900">150+</h2>
            <p className="text-sm text-slate-500 font-medium">
              Scholars Supported
            </p>
            <div className="mt-4 h-1 w-10 bg-amber-500 rounded-full"></div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-10 py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div className="bg-gradient-to-br from-amber-100 to-amber-400 h-[350px] rounded-3xl shadow-xl"></div>

        <div>
          <h2 className="text-4xl font-serif font-black mb-6">
            What is UPVIS?
          </h2>

          <p className="text-slate-600 mb-6">
            UPVIS is a donation platform dedicated to supporting students of the
            University of the Philippines Visayas. It connects donors with scholars
            who need financial assistance to continue their education.
          </p>

          <p className="text-slate-600 mb-6">
            All donations are pooled and distributed equally to ensure fairness
            and that every scholar receives support.
          </p>

          <div className="space-y-3">
            <p>✔ <strong>Transparent Donations</strong> — Track every peso.</p>
            <p>✔ <strong>Verified Scholars</strong> — Real students.</p>
            <p>✔ <strong>Equal Support System</strong> — Fair distribution.</p>
          </div>
        </div>

      </section>

      {/* HOW TO HELP */}
      <section id="help" className="px-10 py-28 max-w-7xl mx-auto text-center">

        <h2 className="text-4xl font-serif font-black mb-4">
          How You Can Help
        </h2>

        <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
          Every action—big or small—helps a student continue their journey.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          {/* DONATE */}
          <div className="group bg-white p-8 rounded-2xl border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition cursor-pointer">
            <div className="text-4xl mb-4">💛</div>
            <h3 className="text-xl font-bold mb-2">Donate</h3>
            <p className="text-slate-500 text-sm mb-4">
              Give any amount to support UPVIS scholars.
            </p>
            <span className="text-amber-600 font-semibold group-hover:underline">
              Donate Now →
            </span>
          </div>

          {/* SHARE */}
          <div className="group bg-white p-8 rounded-2xl border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition cursor-pointer">
            <div className="text-4xl mb-4">📣</div>
            <h3 className="text-xl font-bold mb-2">Spread the Word</h3>
            <p className="text-slate-500 text-sm mb-4">
              Help us reach more donors by sharing the platform.
            </p>
            <span className="text-amber-600 font-semibold group-hover:underline">
              Share Now →
            </span>
          </div>

          {/* VOLUNTEER / PARTNER */}
          <div className="group bg-white p-8 rounded-2xl border border-amber-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition cursor-pointer">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Volunteer With Us</h3>
            <p className="text-slate-500 text-sm mb-4">
              Join our team in packing and preparing support for scholars.
            </p>
            <span className="text-amber-600 font-semibold group-hover:underline">
              Join as Volunteer →
            </span>
          </div>

        </div>

      </section>

      {/* SCHOLARS */}
      <section id="scholars" className="px-10 py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div className="bg-slate-200 h-[350px] rounded-3xl"></div>

        <div>
          <h2 className="text-3xl font-serif font-black mb-4">
            Meet a UPVIS Scholar
          </h2>

          <p className="text-slate-600 mb-6">
            “Because of donors like you, I can continue my studies.
            Your support helps me focus on my dreams.”
          </p>

          <button
            onClick={() => navigate("/register")}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition"
          >
            Help a Scholar
          </button>
        </div>

      </section>

      {/* CONTACT (UPGRADED) */}
      <section id="contact" className="px-10 py-28 bg-white">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-serif font-black mb-6">
            Get in Touch
          </h2>

          <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
            Have questions, want to collaborate, or support our mission in other ways?
            We’d love to hear from you.
          </p>

          {/* CONTACT OPTIONS */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">

            {/* EMAIL */}
            <div className="bg-[#FAF9F6] border border-amber-100 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold text-lg mb-1">Email Us</h3>
              <p className="text-sm text-slate-500">support@upvis.org</p>
            </div>

            {/* FACEBOOK / SOCIAL */}
            <div className="bg-[#FAF9F6] border border-amber-100 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-1">Message Us</h3>
              <p className="text-sm text-slate-500">Facebook / Messenger</p>
            </div>

            {/* LOCATION */}
            <div className="bg-[#FAF9F6] border border-amber-100 rounded-2xl p-6 hover:shadow-lg transition">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-1">Visit Us</h3>
              <p className="text-sm text-slate-500">UP Visayas, Iloilo</p>
            </div>

          </div>

          {/* CTA BUTTON */}
          <button
            onClick={() => navigate("/register")}
            className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-900 transition"
          >
            Contact Us
          </button>

        </div>
      </section>

      {/* FINAL CTA (COMPACT VERSION) */}
      <section className="relative py-20 px-10 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white overflow-hidden">

        {/* background glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]"></div>

        {/* subtle shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-5">
            Be the Reason Someone
            <br />
            <span className="text-amber-100">Stays in School</span>
          </h2>

          <p className="text-amber-100 text-base max-w-xl mx-auto mb-6">
            Your donation helps students continue their education and build a better future.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">

            <button
              onClick={() => navigate("/register")}
              className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-100 transition"
            >
              Start Donating
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="border border-white/50 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Learn More
            </button>

          </div>

          {/* TRUST LINE */}
          <p className="text-sm text-amber-100/80 mt-5">
            ✔ 100% Transparency • ✔ Verified Scholars • ✔ Real Impact
          </p>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;