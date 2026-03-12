const SummaryCards = ({ summary }: { summary: any }) => {
    const cards = [
        { label: 'Total Donations', value: summary.totalDonations, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Expenses', value: summary.totalExpenses, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Current Balance', value: summary.balance, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => (
                <div key={card.label} className={`${card.bg} p-6 rounded-xl border border-gray-100 shadow-sm`}>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>
                        ₱{card.value?.toLocaleString() || '0'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards; 