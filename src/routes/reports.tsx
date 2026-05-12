import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { monthlySales, sourceData, topDestinations, agentPerformance, conversionFunnel } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reportes — Voyage CRM" }, { name: "description", content: "Reportes y analytics comerciales del CRM turístico." }] }),
  component: ReportsPage,
});

const COLORS = ["oklch(0.58 0.13 195)", "oklch(0.62 0.16 155)", "oklch(0.65 0.14 240)", "oklch(0.78 0.16 75)", "oklch(0.62 0.18 320)"];

function ReportsPage() {
  const max = Math.max(...conversionFunnel.map((s) => s.value));
  return (
    <>
      <Topbar title="Reportes Comerciales" subtitle="Analytics & KPIs" />
      <main className="flex-1 p-4 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {["Últimos 30 días", "Este trimestre", "Año actual"].map((t, i) => (
            <Badge key={t} variant={i === 0 ? "default" : "outline"} className="cursor-pointer">{t}</Badge>
          ))}
          <Button variant="outline" size="sm" className="ml-auto gap-1.5"><Filter className="h-3.5 w-3.5" />Filtros</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" />Exportar</Button>
        </div>

        {/* Conversion funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-1">Funnel de conversión</h3>
            <p className="text-xs text-muted-foreground mb-4">De lead a venta</p>
            <div className="space-y-2">
              {conversionFunnel.map((stage, i) => {
                const w = (stage.value / max) * 100;
                const conv = i === 0 ? 100 : Math.round((stage.value / conversionFunnel[0].value) * 100);
                return (
                  <div key={stage.stage}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-muted-foreground">{stage.value} · {conv}%</span>
                    </div>
                    <div className="h-8 rounded-md overflow-hidden bg-muted/40">
                      <div className="h-full gradient-primary flex items-center justify-end pr-2 text-white text-[10px] font-semibold transition-all" style={{ width: `${w}%` }}>
                        {stage.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold">Ventas mensuales</h3>
                <p className="text-xs text-muted-foreground">Evolución de ingresos</p>
              </div>
              <Badge className="bg-success/10 text-success border-0">+24% YoY</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlySales}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.13 195)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.58 0.13 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.008 240)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="oklch(0.5 0.02 250)" fontSize={11} />
                <YAxis tickLine={false} axisLine={false} stroke="oklch(0.5 0.02 250)" fontSize={11} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
                <Area type="monotone" dataKey="sales" stroke="oklch(0.58 0.13 195)" strokeWidth={2.5} fill="url(#gR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-1">Fuentes de leads</h3>
            <p className="text-xs text-muted-foreground mb-2">Distribución</p>
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft lg:col-span-2">
            <h3 className="font-display font-semibold mb-1">Destinos más vendidos</h3>
            <p className="text-xs text-muted-foreground mb-2">Top 6 por ingresos</p>
            <ResponsiveContainer width="100%" height={210}>
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
          <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-1">Pipeline performance</h3>
            <p className="text-xs text-muted-foreground mb-2">Deals cerrados por mes</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.008 240)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
                <Line type="monotone" dataKey="deals" stroke="oklch(0.62 0.16 155)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.62 0.16 155)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-3">Rendimiento por agente</h3>
            <div className="space-y-3">
              {agentPerformance.map((a) => (
                <div key={a.agent} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium truncate">{a.agent}</span>
                      <span className="text-muted-foreground">€{a.revenue.toLocaleString()} · {a.deals} deals</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-primary" style={{ width: `${a.conversion * 2}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-success w-10 text-right">{a.conversion}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
