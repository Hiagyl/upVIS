import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    Users,
    Wallet,
    GraduationCap,
    ShieldCheck 
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
        { name: 'Transactions', icon: <Receipt size={20} />, href: '/transactions' },
        { name: 'Donors', icon: <Users size={20} />, href: '/donors' },
        { name: 'Scholars', icon: <GraduationCap size={20} />, href: '/scholars' },
        { name: 'Members', icon: <ShieldCheck size={20} />, href: '/members' }, // New Item
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50 shadow-xl">
            {/* Brand Logo Area */}
            <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                    <Wallet className="text-blue-400" size={24} />
                </div>
                <span className="tracking-tight italic">upVIS</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-blue-600/10 text-blue-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {/* Active Indicator Bar */}
                            {isActive && (
                                <div className="absolute left-[-16px] h-6 w-1 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            )}

                            <span className={`${isActive ? 'text-blue-400' : 'group-hover:scale-110 transition-transform'}`}>
                                {item.icon}
                            </span>

                            <span className="font-semibold text-sm tracking-wide">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer info */}
            <div className="p-6 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">System Status</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-slate-300">v1.0.0-beta</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;