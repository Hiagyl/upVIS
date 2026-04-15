import { X, Sparkles } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      {/* Reduced max-width from 2xl to md for a more compact feel */}
      <div className="bg-[#FAF9F6] rounded-[1.5rem] w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-2 border-amber-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Compact Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 bg-white border-b-2 border-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Sparkles size={16} fill="currentColor" />
            </div>
            <h2 className="text-xl font-serif font-black text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Focused Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="text-slate-800">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
