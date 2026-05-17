import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error";

export interface ToastData {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (title: string, message?: string) => addToast("success", title, message),
    error: (title: string, message?: string) => addToast("error", title, message),
  };

  return { toasts, removeToast, toast };
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

const ToastItem = ({
  data,
  onRemove,
}: {
  data: ToastData;
  onRemove: () => void;
}) => {
  useEffect(() => {
    const id = window.setTimeout(onRemove, 3500);
    return () => window.clearTimeout(id);
  }, [onRemove]);

  const isSuccess = data.type === "success";

  return (
    <div
      className={`flex items-start gap-4 w-full max-w-sm rounded-2xl border-2 bg-white shadow-xl px-5 py-4 transition-all ${
        isSuccess ? "border-amber-200" : "border-red-200"
      }`}
    >
      <div
        className={`mt-0.5 shrink-0 rounded-full p-1.5 ${
          isSuccess ? "bg-amber-50 text-amber-500" : "bg-red-50 text-red-500"
        }`}
      >
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm leading-snug">{data.title}</p>
        {data.message && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{data.message}</p>
        )}
      </div>

      <button
        onClick={onRemove}
        className="shrink-0 mt-0.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Toast Container ──────────────────────────────────────────────────────────

const ToastContainer = ({
  toasts,
  onRemove,
}: {
  toasts: ToastData[];
  onRemove: (id: number) => void;
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} data={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;