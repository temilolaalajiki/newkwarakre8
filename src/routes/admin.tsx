import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown, ChevronRight, Download, FileSpreadsheet,
  LayoutDashboard, LogOut, Layers, Search, UserCheck, Users, X,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { getAdminDashboard, type Registration } from "@/lib/admin.functions";
import { CLASSES, BATCH_CAPACITY } from "@/lib/event";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Kwara Kre8ives" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type DashboardData = { registrations: Registration[]; capacity: number };

function AdminPage() {
  const fetchDashboard = useServerFn(getAdminDashboard);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  const refresh = async () => {
    if (!password) return;
    const res = await fetchDashboard({ data: { password } });
    console.log("ADMIN RESPONSE:", res);
    if (res.ok) setData({ registrations: res.registrations, capacity: res.capacity });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboard({ data: { password } });
      if (!res.ok) setError(res.error);
      else setData({ registrations: res.registrations, capacity: res.capacity });
    // } catch {
      // setError("Something went wrong");
     } catch (err: any) {
  console.error(err);
  setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <form onSubmit={onSubmit} className="glass w-full max-w-sm rounded-3xl p-8 space-y-4">
          <h1 className="font-display text-2xl text-foreground">Admin access</h1>
          <p className="text-sm text-muted-foreground">Enter the admin password to view the dashboard.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl bg-background/50 border border-border px-4 py-3 text-foreground outline-none focus:border-primary"
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-gradient-gold px-4 py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <AdminShell
      data={data}
      onLogout={() => { setPassword(""); setData(null); }}
    />
  );
}

// ============================================================================
//                                  SHELL
// ============================================================================

type ViewId =
  | "dashboard" | "registrations" | "batches"
  | "checkout" | "exports";

const NAV: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "registrations", label: "Registrations", icon: Users },
  { id: "batches", label: "Batches", icon: Layers },
  { id: "checkout", label: "Check In", icon: UserCheck },
  { id: "exports", label: "Exports", icon: FileSpreadsheet },
];

type Settings = { batchSize: number; nearFullThreshold: number; notifyAlerts: boolean };
const DEFAULT_SETTINGS: Settings = { batchSize: BATCH_CAPACITY, nearFullThreshold: 80, notifyAlerts: true };

function useLocalState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch { return initial; }
  });
  const set = (next: T) => {
    setV(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* */ }
  };
  return [v, set];
}

function AdminShell({ data, onLogout }: { data: DashboardData; onLogout: () => void }) {
  const [view, setView] = useState<ViewId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings] = useLocalState<Settings>("admin.settings", DEFAULT_SETTINGS);
  const [checkedOut, setCheckedOut] = useLocalState<Record<string, string>>("admin.checkedOut", {});

  const capacity = settings.batchSize || BATCH_CAPACITY;
  const categories = useCategories(data.registrations, capacity, settings.nearFullThreshold);

  const title = NAV.find((n) => n.id === view)?.label ?? "Dashboard";

  return (
    <div className="admin-shell min-h-screen flex bg-[var(--as-bg)] text-foreground">
      {/* Sidebar */}
      <SidebarNav
        view={view}
        onSelect={(id) => { setView(id); setSidebarOpen(false); }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar
          title={title}
          onMenu={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            {view === "dashboard" && <DashboardView registrations={data.registrations} categories={categories} capacity={capacity} />}
            {view === "registrations" && <RegistrationsView registrations={data.registrations} />}
            {view === "batches" && <BatchesView categories={categories} capacity={capacity} />}
            {view === "checkout" && <CheckOutView registrations={data.registrations} checkedOut={checkedOut} setCheckedOut={setCheckedOut} />}
            {view === "exports" && <ExportsView registrations={data.registrations} categories={categories} capacity={capacity} checkedOut={checkedOut} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================================================
//                                SIDEBAR
// ============================================================================

function SidebarNav({
  view, onSelect, open, onClose, onLogout,
}: {
  view: ViewId; onSelect: (id: ViewId) => void; open: boolean; onClose: () => void; onLogout: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && <div onClick={onClose} className="fixed inset-0 z-40 bg-[var(--as-backdrop)] lg:hidden" />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[var(--as-surface)] border-r border-[var(--as-border-5)] transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--as-border-5)]">
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-auto" />
            <span className="font-display text-sm text-[var(--as-text-90)]">​</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-[var(--as-text-60)] hover:text-[var(--as-text)]"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/15 text-primary border-l-2 border-primary"
                    : "text-[var(--as-text-60)] hover:text-[var(--as-text)] hover:bg-[var(--as-overlay-5)] border-l-2 border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-[var(--as-text-50)] group-hover:text-[var(--as-text)]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[var(--as-border-5)] p-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--as-text-60)] hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
//                                TOP BAR
// ============================================================================

function TopBar({
  title, onMenu,
}: { title: string; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--as-surface-90)] backdrop-blur border-b border-[var(--as-border-5)] px-4 sm:px-6 flex items-center gap-3">
      <button onClick={onMenu} className="lg:hidden text-[var(--as-text-70)] hover:text-[var(--as-text)]">
        <Layers className="h-5 w-5" />
      </button>
      <h1 className="font-display text-lg sm:text-xl text-[var(--as-text)] truncate">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <div className="h-9 w-9 rounded-full bg-gradient-gold grid place-items-center text-[11px] font-semibold text-primary-foreground">
          AD
        </div>
      </div>
    </header>
  );
}

// ============================================================================
//                              DATA HOOKS
// ============================================================================

type CategoryAgg = {
  name: string;
  total: number;
  batches: { letter: string; filled: number }[];
  activeBatches: number;
  totalSlots: number;
  remaining: number;
  fillPct: number;
  currentBatch: { letter: string; filled: number };
  currentBatchPct: number;
  isFull: boolean;
  isNearFull: boolean;
};

function useCategories(registrations: Registration[], capacity: number, nearFullThreshold: number): CategoryAgg[] {
  return useMemo(() => {
    return CLASSES.map((c) => {
      const items = registrations.filter((r) => r.creative_interest === c.name);
      const total = items.length;
      const batchCount = Math.max(1, Math.ceil(total / capacity) || 1);
      const batches: { letter: string; filled: number }[] = [];
      for (let i = 0; i < batchCount; i++) {
        const filled = Math.min(capacity, Math.max(0, total - i * capacity));
        batches.push({ letter: String.fromCharCode(65 + i), filled });
      }
      const activeBatches = batches.length;
      const totalSlots = activeBatches * capacity;
      const remaining = totalSlots - total;
      const fillPct = totalSlots ? (total / totalSlots) * 100 : 0;
      const currentBatch = batches[batches.length - 1];
      const currentBatchPct = (currentBatch.filled / capacity) * 100;
      return {
        name: c.name, total, batches, activeBatches, totalSlots, remaining, fillPct, currentBatch, currentBatchPct,
        isFull: currentBatch.filled === capacity,
        isNearFull: currentBatchPct >= nearFullThreshold && currentBatch.filled < capacity,
      };
    });
  }, [registrations, capacity, nearFullThreshold]);
}

// ============================================================================
//                                VIEWS
// ============================================================================

function DashboardView({
  registrations, categories, capacity,
}: { registrations: Registration[]; categories: CategoryAgg[]; capacity: number }) {
  const totalRegs = registrations.length;
  const totalSlots = 2000;
  const totalRemaining = totalSlots - totalRegs;

  return (
    <div className="space-y-6">
      <SectionHeader title="Overview" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Total Registrations" value={totalRegs} accent />
        <Stat label="Filled Slots" value={totalRegs} />
        <Stat label="Remaining Slots" value={totalRemaining} />
      </div>


      <Card>
        <CardHeader title="Capacity snapshot" subtitle="All creative tracks" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <MiniCategory key={c.name} c={c} capacity={capacity} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function RegistrationsView({ registrations, initialSearch }: { registrations: Registration[]; initialSearch?: string }) {
  const [q, setQ] = useState(initialSearch ?? "");
  const [category, setCategory] = useState<string>("all");
  const [batch, setBatch] = useState<string>("all");
  const [sortDir, setSortDir] = useState<"newest" | "oldest">("newest");

  useEffect(() => { if (initialSearch) setQ(initialSearch); }, [initialSearch]);

  const allBatches = useMemo(() => Array.from(new Set(registrations.map((r) => r.class_batch))).sort(), [registrations]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return registrations
      .filter((r) => {
        if (category !== "all" && r.creative_interest !== category) return false;
        if (batch !== "all" && r.class_batch !== batch) return false;
        if (!term) return true;
        return (
          r.full_name.toLowerCase().includes(term) ||
          r.email.toLowerCase().includes(term) ||
          r.phone_number.toLowerCase().includes(term) ||
          r.id.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        const da = new Date(a.registration_timestamp).getTime();
        const db = new Date(b.registration_timestamp).getTime();
        return sortDir === "newest" ? db - da : da - db;
      });
  }, [registrations, q, category, batch, sortDir]);

  return (
    <div className="space-y-5">
      <SectionHeader title="All Registrations" subtitle={`Showing ${filtered.length} of ${registrations.length}`} />

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FilterInput value={q} onChange={setQ} placeholder="Search name, email, phone or ID…" />
          <FilterSelect value={category} onChange={setCategory} options={[["all", "All categories"], ...CLASSES.map((c) => [c.name, c.name] as [string, string])]} />
          <FilterSelect value={batch} onChange={setBatch} options={[["all", "All batches"], ...allBatches.map((b) => [b, b] as [string, string])]} />
          <FilterSelect value={sortDir} onChange={(v) => setSortDir(v as "newest" | "oldest")} options={[["newest", "Newest first"], ["oldest", "Oldest first"]]} />
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--as-border-5)] bg-[var(--as-card-2)]">
          <table className="w-full text-sm">
            <thead className="text-left text-[11px] uppercase tracking-wider text-[var(--as-text-40)] bg-[var(--as-overlay-2)]">
              <tr>
                <Th>ID</Th><Th>Name</Th><Th>Phone</Th><Th>Email</Th>
                <Th>Batch</Th><Th>Registered</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-[var(--as-border-5)] hover:bg-[var(--as-overlay-3)]">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--as-text-50)]">{r.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-[var(--as-text)]">{r.full_name}</td>
                  <td className="px-4 py-3 text-[var(--as-text-80)]">{r.phone_number}</td>
                  <td className="px-4 py-3 text-[var(--as-text-80)]">{r.email}</td>
                  <td className="px-4 py-3">
                    <div className="text-[var(--as-text-80)] text-xs">{r.creative_interest}</div>
                    <span className="rounded-full bg-primary/15 text-primary text-[11px] px-2 py-0.5">{r.class_batch.replace(r.creative_interest, "").trim() || r.class_batch}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--as-text-60)] text-xs">{new Date(r.registration_timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--as-text-40)]">No registrations match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CategoriesView({ categories }: { categories: CategoryAgg[] }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Categories" subtitle="Class capacity monitoring for all creative tracks." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.name}>
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg text-[var(--as-text)]">{c.name}</h3>
              <StatusPill isFull={c.isFull} isNearFull={c.isNearFull} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <KV label="Registered" value={c.total} />
              <KV label="Remaining" value={c.remaining} />
              <KV label="Batches" value={c.activeBatches} />
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs text-[var(--as-text-50)] mb-1.5">
                <span>Total fill</span><span>{Math.round(c.fillPct)}%</span>
              </div>
              <ProgressBar pct={c.fillPct} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function BatchesView({ categories, capacity }: { categories: CategoryAgg[]; capacity: number }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(CLASSES.map((c, i) => [c.name, i === 0])));
  return (
    <div className="space-y-5">
      <SectionHeader title="Batches" subtitle="Detailed batch allocation per category." />
      <Card padding="sm">
        <div className="divide-y divide-white/5">
          {categories.map((c) => {
            const isOpen = open[c.name];
            return (
              <div key={c.name}>
                <button
                  onClick={() => setOpen({ ...open, [c.name]: !isOpen })}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4 hover:bg-[var(--as-overlay-2)] transition"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4 text-[var(--as-text-40)]" />}
                    <span className="font-medium text-[var(--as-text)]">{c.name}</span>
                    <span className="text-xs text-[var(--as-text-40)]">{c.activeBatches} batch{c.activeBatches > 1 ? "es" : ""}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--as-text-50)]">{c.total}/{c.totalSlots}</span>
                    <StatusPill isFull={c.isFull} isNearFull={c.isNearFull} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    {c.batches.map((b) => {
                      const pct = (b.filled / capacity) * 100;
                      return (
                        <div key={b.letter} className="rounded-lg bg-[var(--as-card)] border border-[var(--as-border-5)] p-3">
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-[var(--as-text)]">{c.name} — Class {b.letter}</span>
                            <span className="text-[var(--as-text-60)] tabular-nums">{b.filled}/{capacity}</span>
                          </div>
                          <ProgressBar pct={pct} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AnalyticsView({ registrations, categories }: { registrations: Registration[]; categories: CategoryAgg[] }) {
  const trend = useDailyTrend(registrations, 30);
  const cumulative = useMemo(() => {
    let total = 0;
    return trend.map((d) => ({ day: d.day, total: (total += d.count) }));
  }, [trend]);
  const catData = categories.map((c) => ({ name: shortName(c.name), value: c.total, remaining: c.remaining }));

  return (
    <div className="space-y-5">
      <SectionHeader title="Analytics" subtitle="Registration trends and category performance." />

      <Card>
        <CardHeader title="Cumulative growth" subtitle="Running registrations total" />
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulative} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gold2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E7C873" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#E7C873" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="total" stroke="#E7C873" strokeWidth={2} fill="url(#gold2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Daily registrations" subtitle="Last 30 days" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(231,200,115,0.08)" }} />
                <Bar dataKey="count" fill="#E7C873" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Category performance" subtitle="Registered vs remaining" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} angle={-25} textAnchor="end" height={60} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(231,200,115,0.06)" }} />
                <Bar dataKey="value" stackId="a" fill="#E7C873" radius={[0, 0, 0, 0]} />
                <Bar dataKey="remaining" stackId="a" fill="rgba(255,255,255,0.08)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CheckOutView({
  registrations, checkedOut, setCheckedOut,
}: { registrations: Registration[]; checkedOut: Record<string, string>; setCheckedOut: (v: Record<string, string>) => void }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return registrations.slice(0, 25);
    return registrations.filter((r) =>
      r.full_name.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      r.phone_number.toLowerCase().includes(term) ||
      r.id.toLowerCase().startsWith(term),
    ).slice(0, 50);
  }, [registrations, term]);

  const checkedCount = Object.keys(checkedOut).length;
  const pending = registrations.length - checkedCount;

  const mark = (id: string) => setCheckedOut({ ...checkedOut, [id]: new Date().toISOString() });
  const unmark = (id: string) => {
    const next = { ...checkedOut };
    delete next[id];
    setCheckedOut(next);
  };

  return (
    <div className="space-y-5">
      <SectionHeader title="Check In" subtitle="Manually confirm participant entry to their session." />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Total Participants" value={registrations.length} />
        <Stat label="Checked In" value={checkedCount} accent />
        <Stat label="Pending Check In" value={pending} tone={pending > 0 ? "warn" : "default"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Find participant" subtitle="Search by name, email, phone or ID" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--as-text-40)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              placeholder="Start typing…"
              className="w-full rounded-lg bg-[var(--as-card)] border border-[var(--as-border-10)] pl-9 pr-3 py-2.5 text-sm text-[var(--as-text)] placeholder:text-[var(--as-text-40)] outline-none focus:border-primary/60"
            />
          </div>
          <div className="mt-4 max-h-[460px] overflow-y-auto divide-y divide-white/5 rounded-xl border border-[var(--as-border-5)]">
            {results.map((r) => {
              const ts = checkedOut[r.id];
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition ${
                    selected?.id === r.id ? "bg-primary/10" : "hover:bg-[var(--as-overlay-3)]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-sm text-[var(--as-text)] truncate">{r.full_name}</div>
                    <div className="text-xs text-[var(--as-text-50)] truncate">{r.creative_interest} · {r.class_batch}</div>
                  </div>
                  {ts ? (
                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5">Checked in</span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider rounded-full bg-[var(--as-overlay-10)] text-[var(--as-text-50)] px-2 py-0.5">Pending</span>
                  )}
                </button>
              );
            })}
            {results.length === 0 && <div className="px-4 py-10 text-center text-[var(--as-text-40)] text-sm">No matches.</div>}
          </div>
        </Card>

        <Card>
          <CardHeader title="Participant details" />
          {!selected ? (
            <div className="text-sm text-[var(--as-text-40)] py-10 text-center">Select a participant to view details.</div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--as-text-40)] mb-1">Name</div>
                <div className="text-[var(--as-text)]">{selected.full_name}</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-[var(--as-text-40)]">Phone</div><div className="text-[var(--as-text-90)]">{selected.phone_number}</div></div>
                <div><div className="text-xs text-[var(--as-text-40)]">Email</div><div className="text-[var(--as-text-90)] truncate">{selected.email}</div></div>
                <div><div className="text-xs text-[var(--as-text-40)]">Category</div><div className="text-[var(--as-text-90)]">{selected.creative_interest}</div></div>
                <div><div className="text-xs text-[var(--as-text-40)]">Batch</div><div className="text-[var(--as-text-90)]">{selected.class_batch.replace(selected.creative_interest, "").trim() || selected.class_batch}</div></div>
                <div><div className="text-xs text-[var(--as-text-40)]">State / LGA</div><div className="text-[var(--as-text-90)]">{selected.state_lga}</div></div>
                <div><div className="text-xs text-[var(--as-text-40)]">Age</div><div className="text-[var(--as-text-90)]">{selected.age_range}</div></div>
              </div>
              {checkedOut[selected.id] ? (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-sm">
                  <div className="text-emerald-400 font-medium">Checked in</div>
                  <div className="text-xs text-[var(--as-text-60)] mt-0.5">{new Date(checkedOut[selected.id]).toLocaleString()}</div>
                  <button onClick={() => unmark(selected.id)} className="mt-3 text-xs text-[var(--as-text-60)] hover:text-[var(--as-text)] underline">Undo check in</button>
                </div>
              ) : (
                <button
                  onClick={() => mark(selected.id)}
                  className="w-full rounded-lg bg-gradient-gold py-3 text-xs px-[14px] font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  Check In
                </button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ExportsView({
  registrations, categories, capacity, checkedOut,
}: { registrations: Registration[]; categories: CategoryAgg[]; capacity: number; checkedOut: Record<string, string> }) {
  const exports: { title: string; desc: string; onClick: () => void }[] = [
    {
      title: "Full registration CSV",
      desc: "All participant records with full details.",
      onClick: () => exportCSV("all-registrations.csv", registrations),
    },
    {
      title: "Category exports",
      desc: "One CSV per category with its registered participants.",
      onClick: () => CLASSES.forEach((c) => {
        const rows = registrations.filter((r) => r.creative_interest === c.name);
        if (rows.length) exportCSV(`${slug(c.name)}.csv`, rows);
      }),
    },
    {
      title: "Check-in report",
      desc: "Participants marked as checked in with timestamps.",
      onClick: () => {
        const rows = registrations
          .filter((r) => checkedOut[r.id])
          .map((r) => ({
            id: r.id, full_name: r.full_name, email: r.email, phone_number: r.phone_number,
            category: r.creative_interest, batch: r.class_batch, checked_in_at: checkedOut[r.id],
          }));
        exportGenericCSV("check-in-report.csv", rows);
      },
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Exports" subtitle="Download registration reports and CSV files." />
      <div className="grid gap-4 sm:grid-cols-2">
        {exports.map((e) => (
          <Card key={e.title}>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 grid place-items-center rounded-lg bg-primary/15 text-primary"><Download className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-[var(--as-text)]">{e.title}</h3>
                <p className="text-sm text-[var(--as-text-50)] mt-0.5">{e.desc}</p>
                <button onClick={e.onClick} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-gold px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
                  <Download className="h-4 w-4" /> Download
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ settings, setSettings }: { settings: Settings; setSettings: (v: Settings) => void }) {
  return (
    <div className="space-y-5">
      <SectionHeader title="Settings" subtitle="Admin dashboard preferences." />

      <Card>
        <CardHeader title="Capacity" subtitle="Controls how batches are calculated and when warnings appear." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Batch size" hint="Default 50 participants per batch.">
            <input
              type="number" min={1} max={500}
              value={settings.batchSize}
              onChange={(e) => setSettings({ ...settings, batchSize: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full rounded-lg bg-[var(--as-card)] border border-[var(--as-border-10)] px-3 py-2 text-sm text-[var(--as-text)] outline-none focus:border-primary/60"
            />
          </Field>
          <Field label={`Near-full alert threshold (${settings.nearFullThreshold}%)`} hint="A batch is flagged near-full once it reaches this fill percentage.">
            <input
              type="range" min={50} max={99} step={1}
              value={settings.nearFullThreshold}
              onChange={(e) => setSettings({ ...settings, nearFullThreshold: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Notifications" subtitle="Manage in-app capacity alerts." />
        <Toggle
          label="Show capacity alerts in dashboard"
          checked={settings.notifyAlerts}
          onChange={(v) => setSettings({ ...settings, notifyAlerts: v })}
        />
      </Card>
    </div>
  );
}

// ============================================================================
//                           SHARED PRIMITIVES
// ============================================================================

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl text-[var(--as-text)]">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-[var(--as-text-50)]">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = "", padding = "md" }: { children: React.ReactNode; className?: string; padding?: "sm" | "md" }) {
  const p = padding === "sm" ? "p-2" : "p-5 sm:p-6";
  return <div className={`rounded-2xl bg-[var(--as-card)] border border-[var(--as-border-5)] ${p} ${className}`}>{children}</div>;
}

function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h3 className="font-medium text-[var(--as-text)]">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--as-text-40)] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Stat({ label, value, accent, tone = "default" }: { label: string; value: number; accent?: boolean; tone?: "default" | "warn" | "danger" }) {
  const color = tone === "danger" ? "text-destructive" : tone === "warn" ? "text-primary" : accent ? "text-primary" : "text-[var(--as-text)]";
  return (
    <div className="rounded-2xl bg-[var(--as-card)] border border-[var(--as-border-5)] p-4 sm:p-5 transition hover:border-primary/30">
      <div className="text-[11px] uppercase tracking-wider text-[var(--as-text-40)]">{label}</div>
      <div className={`mt-2 font-display text-3xl tabular-nums ${color}`}>{value.toLocaleString()}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display text-xl text-primary tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--as-text-40)] mt-1">{label}</div>
    </div>
  );
}

function StatusPill({ isFull, isNearFull }: { isFull: boolean; isNearFull: boolean }) {
  const cls = isFull
    ? "bg-destructive/15 text-destructive"
    : isNearFull
      ? "bg-primary/15 text-primary"
      : "bg-emerald-500/15 text-emerald-400";
  return <span className={`rounded-full text-[10px] uppercase tracking-wider px-2.5 py-1 ${cls}`}>{isFull ? "Full" : isNearFull ? "Near full" : "Available"}</span>;
}

function ProgressBar({ pct }: { pct: number }) {
  const tone = pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-primary" : "bg-primary/70";
  return (
    <div className="h-2 rounded-full overflow-hidden bg-[var(--as-overlay-6)]">
      <div className={`h-full transition-all duration-500 ${tone}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

function MiniCategory({ c, capacity }: { c: CategoryAgg; capacity: number }) {
  return (
    <div className="rounded-xl bg-[var(--as-card-2)] border border-[var(--as-border-5)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[var(--as-text)]">{c.name}</span>
        <StatusPill isFull={c.isFull} isNearFull={c.isNearFull} />
      </div>
      <div className="flex items-end justify-between text-xs text-[var(--as-text-50)] mb-1.5">
        <span>{c.total}/{c.totalSlots}</span>
        <span>{Math.round(c.fillPct)}%</span>
      </div>
      <ProgressBar pct={c.fillPct} />
      <div className="text-[11px] text-[var(--as-text-40)] mt-2">{c.activeBatches} batch{c.activeBatches > 1 ? "es" : ""} · {capacity}/batch</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}

function FilterInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="rounded-lg bg-[var(--as-card-2)] border border-[var(--as-border-10)] px-3 py-2 text-sm text-[var(--as-text)] placeholder:text-[var(--as-text-40)] outline-none focus:border-primary/60"
    />
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <select
      value={value} onChange={(e) => onChange(e.target.value)}
      className="rounded-lg bg-[var(--as-card-2)] border border-[var(--as-border-10)] px-3 py-2 text-sm text-[var(--as-text)] outline-none focus:border-primary/60"
    >
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-[var(--as-text)] block mb-1">{label}</span>
      {children}
      {hint && <span className="text-xs text-[var(--as-text-40)] block mt-1">{hint}</span>}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full text-left"
    >
      <span className="text-sm text-[var(--as-text)]">{label}</span>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-[var(--as-overlay-15)]"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-[var(--as-knob)] transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

// ============================================================================
//                                HELPERS
// ============================================================================

const tooltipStyle = {
  background: "var(--as-card)",
  border: "1px solid var(--as-border-10)",
  borderRadius: 8,
  color: "var(--as-text)",
  fontSize: 12,
} as const;

function shortName(n: string) {
  if (n.length <= 14) return n;
  const parts = n.split(" ");
  if (parts.length > 1) return parts.map((p) => p[0]).slice(0, 3).join("") + " " + parts[parts.length - 1].slice(0, 6);
  return n.slice(0, 12) + "…";
}

function useDailyTrend(registrations: Registration[], days = 14) {
  return useMemo(() => {
    const buckets: Record<string, number> = {};
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      buckets[dayKey(d)] = 0;
    }
    for (const r of registrations) {
      const k = dayKey(new Date(r.registration_timestamp));
      if (k in buckets) buckets[k] += 1;
    }
    return Object.entries(buckets).map(([k, count]) => ({ day: k.slice(5), count }));
  }, [registrations, days]);
}

function dayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function exportCSV(filename: string, rows: Registration[]) {
  const headers = ["id", "full_name", "phone_number", "email", "state_lga", "creative_interest", "class_batch", "age_range", "social_handle", "registration_timestamp"];
  const body = rows.map((r) => headers.map((h) => csvCell((r as unknown as Record<string, unknown>)[h])).join(","));
  downloadCSV(filename, [headers.join(","), ...body].join("\n"));
}

function exportGenericCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) { downloadCSV(filename, ""); return; }
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => csvCell(r[h])).join(","));
  downloadCSV(filename, [headers.join(","), ...body].join("\n"));
}

function csvCell(v: unknown) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
