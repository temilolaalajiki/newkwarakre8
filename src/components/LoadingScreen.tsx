import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 450);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <Logo className="h-16 w-auto animate-float" />
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 bg-gradient-gold shimmer" />
            </div>
            <p className="text-sm tracking-[0.3em] text-muted-foreground">LOADING EXPERIENCE</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
