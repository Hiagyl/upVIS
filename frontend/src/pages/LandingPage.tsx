import React, { useEffect, useState } from "react";
import photo1 from '../assets/photo1.jpg';
import photo6 from '../assets/photo6.jpg';
import photo7 from '../assets/photo7.jpg';
import { useNavigate } from "react-router-dom";

const sections = ["home", "about", "help", "scholars", "contact"];

const LandingPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  // 🔥 SCROLL ACTIVE NAV
  useEffect(() => {
    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - 150;
          if (window.scrollY >= top) {
            current = id;
          }
        }
      });

      setActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 FADE IN
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 bg-[#FAF9F6]/90 backdrop-blur z-50 flex items-center justify-between px-12 py-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-serif font-black tracking-wide">
          UPVIS
        </h1>

        <div className="hidden md:flex items-center gap-8 font-semibold">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => scrollToSection(sec)}
              className={`relative transition ${
                active === sec ? "text-amber-600" : "text-slate-600"
              }`}
            >
              {sec.charAt(0).toUpperCase() + sec.slice(1)}

              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-amber-600 transition-all duration-300 ${
                  active === sec ? "w-full" : "w-0"
                }`}
              ></span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-600 hover:text-amber-600 font-semibold"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold hover:bg-amber-600 transition shadow-md"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="fade-in opacity-0 translate-y-6 transition-all duration-700 px-12 py-28 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-serif font-black leading-tight mb-6">
            Change a Life.
            <br />
            <span className="text-amber-500">Support an Iskolar.</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-lg">
            UPVIS connects donors with UP Visayas students who need support.
            Every donation is transparent, tracked, and impactful.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-slate-900 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition hover:scale-105"
            >
              Donate Now
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="border-2 border-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              Learn More
            </button>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            ✔ 100% Transparency • ✔ Verified Scholars • ✔ Real Impact
          </p>
        </div>

        <div className="relative">
          <div className="w-full h-[400px] bg-white border-2 border-amber-100 rounded-3xl shadow-sm">
            <img src={photo6} alt='picture of upVIS' className="w-full h-full object-cover rounded-3xl"></img>
            <p className="mt-2 text-sm text-slate-500 italic text-center">
        Photo credit: https://www.facebook.com/profile.php?id=61554691509677
      </p>
          </div>
        </div>

      </section>

      {/* STATS */}
      <section className="fade-in opacity-0 translate-y-6 transition-all duration-700 relative max-w-7xl mx-auto -mt-[95px] z-10 px-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-2xl mb-2">👥</div>
            <h2 className="text-2xl font-black">75</h2>
            <p className="text-sm text-slate-500 font-semibold">
              Active Scholars
            </p>
          </div>

          <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-2xl mb-2">💰</div>
            <h2 className="text-2xl font-black">₱250K+</h2>
            <p className="text-sm text-slate-500 font-semibold">
              Donations Tracked
            </p>
          </div>

          <div className="bg-white border-2 border-amber-100 rounded-2xl px-6 py-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
            <div className="text-2xl mb-2">🎓</div>
            <h2 className="text-2xl font-black">150+</h2>
            <p className="text-sm text-slate-500 font-semibold">
              Scholars Supported
            </p>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="fade-in opacity-0 translate-y-6 transition-all duration-700 px-12 py-28 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div className="bg-white border-2 border-amber-100 h-[350px] rounded-3xl shadow-sm">
          <img src={photo7} alt="Photo of Students accepting donations" className="w-full h-full object-cover rounded-3xl"></img>
          <p>Photo credit: https://www.facebook.com/profile.php?id=61554691509677</p>
        </div>

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

          <div className="space-y-3 font-medium">
            <p>✔ <strong>Transparent Donations</strong> — Track every peso.</p>
            <p>✔ <strong>Verified Scholars</strong> — Real students.</p>
            <p>✔ <strong>Equal Support System</strong> — Fair distribution.</p>
          </div>
        </div>

      </section>

      {/* HOW TO HELP */}
      <section id="help" className="fade-in opacity-0 translate-y-6 transition-all duration-700 px-12 py-28 max-w-7xl mx-auto text-center">

        <h2 className="text-4xl font-serif font-black mb-4">
          How You Can Help
        </h2>

        <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
          Every action—big or small—helps a student continue their journey.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
            <div className="text-4xl mb-4">💛</div>
            <h3 className="text-xl font-bold mb-2">Donate</h3>
            <p className="text-slate-500 text-sm mb-4">
              Give any amount to support UPVIS scholars.
            </p>
            <span className="text-amber-600 font-semibold">
              Donate Now →
            </span>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
            <div className="text-4xl mb-4">📣</div>
            <h3 className="text-xl font-bold mb-2">Spread the Word</h3>
            <p className="text-slate-500 text-sm mb-4">
              Help us reach more donors by sharing the platform.
            </p>
            <span className="text-amber-600 font-semibold">
              Share Now →
            </span>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-amber-100 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Volunteer With Us</h3>
            <p className="text-slate-500 text-sm mb-4">
              Join our team in packing and preparing support for scholars.
            </p>
            <span className="text-amber-600 font-semibold">
              Join as Volunteer →
            </span>
          </div>

        </div>

      </section>

      {/* SCHOLARS */}
      <section id="scholars" className="fade-in opacity-0 translate-y-6 transition-all duration-700 px-12 py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        <div className="bg-white border-2 border-amber-100 h-[350px] rounded-3xl shadow-sm"><img src={photo1} alt="Photo of Students accepting donations" className="w-full h-full object-cover rounded-3xl"></img>
          <p>Photo credit: https://www.facebook.com/profile.php?id=61554691509677</p></div>

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
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition"
          >
            Help a Scholar
          </button>
        </div>

      </section>

      {/* CONTACT */}
      <section id="contact" className="fade-in opacity-0 translate-y-6 transition-all duration-700 px-12 py-28 bg-white">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-serif font-black mb-6">
            Get in Touch
          </h2>

          <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
            Have questions, want to collaborate, or support our mission in other ways?
            We’d love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">

            <div className="bg-[#FAF9F6] border-2 border-amber-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold text-lg mb-1">Email Us</h3>
              <p className="text-sm text-slate-500">support@upvis.org</p>
            </div>

            <div className="bg-[#FAF9F6] border-2 border-amber-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-1">Message Us</h3>
              <p className="text-sm text-slate-500">Facebook / Messenger</p>
            </div>

            <div className="bg-[#FAF9F6] border-2 border-amber-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-lg mb-1">Visit Us</h3>
              <p className="text-sm text-slate-500">UP Visayas, Iloilo</p>
            </div>

          </div>

          <button
            onClick={() => navigate("/register")}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-amber-600 transition"
          >
            Contact Us
          </button>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="fade-in opacity-0 translate-y-6 transition-all duration-700 relative py-20 px-12 bg-slate-900 text-white overflow-hidden">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-5">
            Be the Reason Someone
            <br />
            <span className="text-amber-300">Stays in School</span>
          </h2>

          <p className="text-amber-100 text-base max-w-xl mx-auto mb-6">
            Your donation helps students continue their education and build a better future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">

            <button
              onClick={() => navigate("/register")}
              className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-amber-100 transition"
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

          <p className="text-sm text-amber-100/80 mt-5">
            ✔ 100% Transparency • ✔ Verified Scholars • ✔ Real Impact
          </p>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;