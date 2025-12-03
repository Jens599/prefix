"use client";

import { CircleCheck, X } from "lucide-react";

interface ToastProps {
  onClose?: () => void;
}

const Toast = ({ onClose }: ToastProps) => {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-8 z-50 flex justify-center">
      <div className="bg-background/95 animate-in slide-in-from-top-4 fade-in pointer-events-auto flex items-center gap-5 rounded-lg border px-8 py-6 shadow-2xl outline-2 outline-indigo-500/40 backdrop-blur-md duration-400">
        <CircleCheck size={36} className="text-indigo-500" strokeWidth={2.5} />

        <div className="flex flex-col text-left">
          <p className="text-foreground text-lg font-semibold">
            Search Query URL
          </p>
          <p className="text-muted-foreground text-sm">Copied to Clipboard.</p>
        </div>

        <button
          onClick={onClose}
          className="hover:bg-muted/80 active:bg-muted ml-4 rounded-full p-2 transition-colors"
          aria-label="Close toast"
        >
          <X className="text-muted-foreground h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
