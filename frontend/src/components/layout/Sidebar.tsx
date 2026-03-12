import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Better for React routing
import { LayoutDashboard, Receipt, Users, Wallet } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
        { name: 'Transactions', icon: <Receipt size={20} />, href: '/transactions' },
        { name: 'Donors', icon: <Users size={20} />, href: '/donors' },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
            {/* Brand Logo Area */}
            <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
                <Wallet className="text-blue-400" />
                <span className="tracking-tight">upVIS</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer info (Optional) */}
            <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                v1.0.0-beta
            </div>
        </div>
    );
};

// This is the line you need!
export default Sidebar;