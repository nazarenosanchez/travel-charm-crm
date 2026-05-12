import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { surveys, recentComments } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, Star, MessageSquareQuote, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";

export const Route = createFileRoute("/surveys")({
  head: () => ({ meta: [{ title: "Encuestas — Voyage CRM" }, { name: "description", content: "Mide la satisfacción y NPS de tus clientes turísticos." }] }),
  component: SurveysPage,
});

const npsTrend = [
  { m: "Ene", nps: 62 }, { m: "Feb", nps: 64 }, { m: "Mar", nps: 68 },
  { m: "Abr", nps: 71 }, { m: "May", nps: 74 },
];

const distribution = [
  { score: "1-6", count: 8 },
  { score: "7", count: 22 },
  { score: "8", count: 48 },
  { score: "9", count: 86 },
  { score: "10", count: 148 },
];

function SurveysPage() {
  return (
    <>
      <Topbar title="Encuestas y Satisfacción" subtitle="Mide la experiencia post-venta de tus clientes" />
      <main className="flex-1 p-4 md:p-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "NPS Score", value: "74", hint: "Excelente", icon: TrendingUp, color: "text-success bg-success/10" },
            { label: "Satisfacción avg", value: "4.6/5", hint: "+0.3 vs Q1", icon: Star, color: "text-warning-foreground bg-warning/20" },
            { label: "Respuestas", value: "720", hint: "este trimestre", icon: ClipboardList, color: "text-info bg-info/10" },
            { label: "Tasa respuesta", value: "62%", hint: "+8% vs Q1", icon: MessageSquareQuote, color: "text-primary bg-primary-soft" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border/70 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${s.color}`}><s.icon className="h-4 w-4" /></div>
              </div>
              <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold">Tendencia NPS</h3>
                <p className="text-xs text-muted-foreground">Evolución mensual</p>
              </div>
              <Badge className="bg-success/10 text-success border-0">+12 pts</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={npsTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.008 240)" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" domain={[40, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
                <Line type="monotone" dataKey="nps" stroke="oklch(0.62 0.16 155)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.62 0.16 155)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
            <h3 className="font-display font-semibold mb-1">Distribución NPS</h3>
            <p className="text-xs text-muted-foreground mb-3">Detractores · Pasivos · Promotores</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.008 240)" />
                <XAxis dataKey="score" tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="oklch(0.5 0.02 250)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.008 240)", fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="oklch(0.58 0.13 195)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Mis encuestas</h2>
          <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Crear encuesta</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {surveys.map((s) => (
            <div key={s.id} className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft hover:shadow-elevated transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.type} · {s.createdAt}</p>
                </div>
                <Badge variant="outline" className={s.status === "Activa" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>{s.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Respuestas</p>
                  <p className="font-display font-bold">{s.responses}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Score promedio</p>
                  <p className="font-display font-bold flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{s.avgScore}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-card border border-border/70 p-5 shadow-soft">
          <h3 className="font-display font-semibold mb-3">Comentarios recientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentComments.map((c, i) => (
              <div key={i} className="rounded-xl border border-border/60 p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <span className={`text-xs font-bold ${c.score >= 9 ? "text-success" : c.score >= 7 ? "text-warning-foreground" : "text-destructive"}`}>{c.score}/10</span>
                </div>
                <p className="text-xs text-muted-foreground italic">"{c.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
