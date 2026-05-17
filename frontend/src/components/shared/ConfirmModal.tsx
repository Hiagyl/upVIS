import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isPending?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  isDestructive = false,
  isPending = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-2xl">
        {/* Top accent bar */}
        <div
          className={`h-2 w-full ${
            isDestructive
              ? "bg-gradient-to-r from-red-400 via-red-500 to-slate-800"
              : "bg-gradient-to-r from-amber-400 via-amber-500 to-slate-800"
          }`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div
            className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full shadow-lg ${
              isDestructive
                ? "bg-red-50 text-red-500"
                : "bg-amber-50 text-amber-500"
            }`}
          >
            <AlertTriangle size={38} />
          </div>

          <h2 className="text-2xl font-serif font-black text-slate-900 mb-2">
            {title}
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">{message}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-2xl border-2 border-slate-200 py-3.5 font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className={`flex-1 rounded-2xl py-3.5 font-black text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                isDestructive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-slate-900 hover:bg-amber-600"
              }`}
            >
              {isPending ? "Processing…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;