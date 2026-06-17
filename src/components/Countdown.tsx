import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    setMounted(true);
    setT(diff(target));
    const i = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(i);
  }, [target]);
  if (!mounted) {
    return <div className="grid grid-cols-4 gap-2 sm:gap-4" suppressHydrationWarning />;
  }
  const items: Array<[string, number]> = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {items.map(([label, v]) => (
        <div key={label} className="glass rounded-2xl px-3 py-4 text-center sm:px-5">
          <div className="font-display text-3xl text-gradient-gold tabular-nums sm:text-5xl">
            {String(v).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
