import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Users,
  GraduationCap,
  ShieldCheck,
  Compass,
  Circle,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    {
      name: "Transactions",
      icon: <Receipt size={20} />,
      href: "/transactions",
    },
    { name: "Donors", icon: <Users size={20} />, href: "/donors" },
    { name: "Scholars", icon: <GraduationCap size={20} />, href: "/scholars" },
    { name: "Members", icon: <ShieldCheck size={20} />, href: "/members" },
  ];

  return (
    <div className="h-screen w-72 bg-[#FAF9F6] text-slate-800 flex flex-col fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.1)] border-r-4 border-amber-100">
      {/* Angelic Brand Emblem */}
      <div className="p-8 mb-4 border-b-2 border-amber-50">
        <div className="flex items-center gap-4">
          <div className="bg-amber-100 p-2.5 rounded-full shadow-sm">
            <Compass className="text-amber-700" size={28} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-black tracking-tight text-slate-900 leading-none">
              up<span className="text-amber-600">VIS</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-amber-700 font-bold mt-1">
              Scholarship Guide
            </span>
          </div>
        </div>
      </div>

      {/* Navigation - Smaller links and tighter spacing */}
      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[10px] uppercase tracking-[0.25em] text-slate-400 font-black mb-3">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 border-2 ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "text-slate-600 border-transparent hover:bg-amber-50 hover:border-amber-200 hover:text-slate-900"
              }`}
            >
              <span
                className={`${isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-600"}`}
              >
                {item.icon}
              </span>

              <span
                className={`text-base tracking-wide ${isActive ? "font-bold" : "font-semibold font-serif"}`}
              >
                {item.name}
              </span>

              {isActive && (
                <Circle
                  className="ml-auto text-amber-400 fill-amber-400"
                  size={8}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Accessible Footer */}
      <div className="p-6 mt-auto">
        <div className="bg-white rounded-xl p-4 border-2 border-amber-100 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1.5">
            System Status
          </p>
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-xs font-bold text-slate-700">
              Online & Secure
            </span>
          </div>
        </div>

        <p className="mt-5 text-[10px] text-center text-slate-400 font-serif italic font-medium leading-relaxed">
          "The path to wisdom is <br /> illuminated by your grace."
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
