import { Sparkles, HandHelping, Landmark } from "lucide-react";

const SummaryCards = ({ summary }: { summary: any }) => {
  const cards = [
    {
      label: "Total Donations", // Plain language for clarity
      value: summary.totalDonations,
      icon: <Sparkles size={24} />,
      // High contrast: Dark text on very light, warm background
      theme: "text-emerald-900 border-emerald-200 bg-[#F0FDF4]",
      accent: "bg-emerald-600",
    },
    {
      label: "Total Expenses",
      value: summary.totalExpenses,
      icon: <HandHelping size={24} />,
      // High contrast: Deep Red on light background
      theme: "text-red-900 border-red-200 bg-[#FEF2F2]",
      accent: "bg-red-600",
    },
    {
      label: "Current Balance",
      value: summary.balance,
      icon: <Landmark size={24} />,
      // The "Lead" Card: Darkest background with white text for maximum pop
      theme: "text-white border-slate-800 bg-slate-900 shadow-xl",
      accent: "bg-amber-400",
      isPrimary: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`
                        ${card.theme} 
                        relative p-10 rounded-2xl border-2 transition-all duration-300 
                        shadow-md hover:shadow-lg
                    `}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
              {/* Bold, high-contrast label for easier reading */}
              <p
                className={`text-xs font-black uppercase tracking-widest ${card.isPrimary ? "text-amber-400" : "text-slate-600"}`}
              >
                {card.label}
              </p>
              {/* Visual anchor line */}
              <div className={`h-1 w-10 rounded-full ${card.accent}`}></div>
            </div>
            <div className={card.isPrimary ? "text-white" : "text-slate-400"}>
              {card.icon}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            {/* Enlarged currency symbol */}
            <span
              className={`text-xl font-bold ${card.isPrimary ? "text-amber-500" : "text-slate-400"}`}
            >
              ₱
            </span>
            {/* Maximum Legibility: Large, thick font for values */}
            <p className="text-5xl font-bold tracking-tight">
              {card.value?.toLocaleString() || "0"}
            </p>
          </div>

          {/* Subtle Identity Touch: An elegant watermark icon in the corner */}
          <div className="absolute -bottom-2 -right-2 opacity-[0.03] pointer-events-none">
            <Landmark size={100} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
