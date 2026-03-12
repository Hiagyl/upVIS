import { LayoutDashboard, Receipt, Users, Wallet } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
        { name: 'Transactions', icon: <Receipt size={20} />, href: '/transactions' },
        { name: 'Donors', icon: <Users size={20} />, href: '/donors' },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
                <Wallet className="text-blue-400" /> upVIS
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
};