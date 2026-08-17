import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none px-4 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toast.type === 'error' ? AlertCircle : toast.type === 'info' ? Info : CheckCircle2;
          const bgStyle = toast.type === 'error' 
            ? 'bg-rose-900 text-white' 
            : toast.type === 'info' 
              ? 'bg-zinc-900 text-white' 
              : 'bg-black text-white';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`py-2.5 px-4 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold tracking-wide ${bgStyle}`}
            >
              <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="truncate">{toast.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
