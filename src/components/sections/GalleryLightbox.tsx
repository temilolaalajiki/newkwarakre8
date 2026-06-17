import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  loader?: () => Promise<string>;
  fallback?: string;
  onClose: () => void;
};

export function GalleryLightbox({ loader, fallback, onClose }: Props) {
  const [src, setSrc] = useState<string | undefined>(fallback);

  useEffect(() => {
    let cancelled = false;
    if (loader) {
      loader().then((full) => {
        if (!cancelled) setSrc(full);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [loader]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-background"
        >
          {src && (
            <img
              src={src}
              alt="Kwara Kre8ives gallery"
              className="h-auto max-h-[85vh] w-full object-contain"
            />
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full glass-strong p-2 text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
