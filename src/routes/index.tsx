import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { StatCard } from "@/components/stat-card";
import { Users, Target, DollarSign, TrendingUp, MapPin, Sparkles } from "lucide-react";
import { monthlySales, sourceData, deals, leads, topDestinations, recentComments } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voyage CRM — Dashboard de ventas turísticas" },
      { name: "description", content: "CRM moderno para agencias de turismo. Gestiona leads, pipeline, campañas y satisfacción del cliente." },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["oklch(0.58 0.13 195)", "oklch(0.62 0.16 155)", "oklch(0.65 0.14 240)", "oklch(0.78 0.16 75)", "oklch(0.62 0.18 320)"];

function Dashboard() {
  const hotDeals = deals.slice(0, 5);
  const newLeads = leads.slice(0, 5);

  return (
    <>
      <Topbar title="Dashboard" subtitle="Resumen comercial · Mayo 2026" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Hero strip */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                <Sparkles className="h-3 w-3" /> Buenos días, María
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">
                Tienes <span className="gradient-text">12 leads calientes</span> esperando seguimiento hoy
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">El pipeline subió un 18% esta semana. Buen ritmo.</p>
            </div>
            <div className="flex gap-6 md:gap-8">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Meta del mes</div>
                <div className="mt-1 font-display text-2xl font-bold">€89k <span className="text-sm text-muted-foreground font-normal">/ €120k</span></div>
                <div className="mt-2 h-1.5 w-32 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: "74%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Leads Nuevos" value="248" delta="+12.4%" icon={Users} hint="vs mes anterior" />
          <StatCard label="Tasa Conversión" value="22.8%" delta="+3.1%" icon={Target} hint="leads → ventas" />
          <StatCard label="Ventas del Mes" value="€89,420" delta="+18.2%" icon={DollarSign} hint="74% de la meta" />
          <StatCard label="Pipeline Activo" value="€312k" delta="-2.1%" positive={false} icon={TrendingUp} hint="46 oportunidades" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold">Ventas mensuales</h3>
                <p className="text-xs text-muted-foreground">Evolución de ingresos comerciales</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-0">+24% YoY</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.13 195)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.58 0.13 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.008 240)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="oklch(0.5 0.02 250)" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="oklch(0.5 0.02 250)" fontSize={11} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
                <Area type="monotone" dataKey="sales" stroke="oklch(0.58 0.13 195)" strokeWidth={2.5} fill="url(#gSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold">Fuentes de leads</h3>
            <p className="text-xs text-muted-foreground mb-2">Top canales del mes</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {sourceData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Hot deals */}
          <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">Oportunidades calientes</h3>
              <span className="text-xs text-muted-foreground">{hotDeals.length} activas</span>
            </div>
            <div className="divide-y divide-border/60">
              {hotDeals.map((d) => (
                <div key={d.id} className="flex items-center gap-3 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">{d.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{d.client}</p>
                      <Badge variant="outline" className="text-[10px] py-0 h-4">{d.stage}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3" /> {d.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">€{d.budget.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">{d.lastInteraction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top destinations */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold">Destinos top</h3>
            <p className="text-xs text-muted-foreground mb-2">Ingresos por destino</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topDestinations} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.008 240)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="destination" type="category" tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" width={70} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} formatter={(v: number) => `€${v.toLocaleString()}`} />
                <Bar dataKey="sales" fill="oklch(0.58 0.13 195)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-3">Leads recientes</h3>
            <div className="space-y-2.5">
              {newLeads.map((l) => (
                <div key={l.id} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition">
                  <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] bg-muted">{l.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{l.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{l.destination} · {l.source}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{l.status}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-3">Comentarios recientes (NPS)</h3>
            <div className="space-y-3">
              {recentComments.map((c, i) => (
                <div key={i} className="rounded-xl border border-border/60 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{c.name}</p>
                    <span className={`text-xs font-semibold ${c.score >= 9 ? "text-success" : c.score >= 7 ? "text-warning" : "text-destructive"}`}>{c.score}/10</span>
                  </div>
                  <p className="text-xs text-muted-foreground">"{c.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
