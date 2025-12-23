import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { useServiceWorkerUpdate } from '@/hooks/useServiceWorkerUpdate';

/**
 * Component that shows a prompt when a new version of the app is available.
 * Appears at the bottom of the screen with options to update or dismiss.
 */
export const UpdatePrompt: React.FC = () => {
    const { needRefresh, updateApp, closeUpdatePrompt } = useServiceWorkerUpdate();

    return (
        <AnimatePresence>
            {needRefresh && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
                >
                    <div className="bg-slate-800 dark:bg-slate-700 rounded-xl shadow-2xl border border-slate-600 p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 p-2 bg-emerald-500/20 rounded-lg">
                                <RefreshCw className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white">
                                    Pembaruan Tersedia
                                </h3>
                                <p className="text-xs text-slate-300 mt-1">
                                    Versi baru aplikasi tersedia. Perbarui sekarang untuk mendapatkan fitur terbaru.
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={updateApp}
                                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Perbarui Sekarang
                                    </button>
                                    <button
                                        onClick={closeUpdatePrompt}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                                        aria-label="Tutup"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
