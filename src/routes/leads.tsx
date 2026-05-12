import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { leads, type Lead, type LeadStatus, statusColors } from "@/lib/mock-data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Phone, Mail, MapPin, Calendar, Users, DollarSign, LayoutGrid, List, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads — Voyage CRM" }, { name: "description", content: "Gestiona leads turísticos: captura, seguimiento y conversión." }] }),
  component: LeadsPage,
});

const STATUSES: LeadStatus[] = ["Nuevo", "Contactado", "Interesado", "Cotizando", "En seguimiento", "Ganado", "Perdido"];

function statusBadge(status: LeadStatus) {
  const variant = statusColors[status];
  const cls: Record<string, string> = {
    info: "bg-info/10 text-info border-info/20",
    secondary: "bg-secondary text-secondary-foreground border-border",
    warning: "bg-warning/15 text-warning-foreground border-warning/30",
    success: "bg-success/10 text-success border-success/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return <Badge variant="outline" className={cn("font-medium", cls[variant])}>{status}</Badge>;
}

function LeadsPage() {
  const [view, setView] = useState<"table" | "cards">("table");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "Todos">("Todos");
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = leads.filter((l) => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.destination.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <Topbar title="Leads" subtitle={`${leads.length} leads · ${leads.filter(l=>l.status==="Nuevo").length} nuevos hoy`} />
      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o destino…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-card" />
          </div>
          <div className="flex flex-wrap gap-1">
            {(["Todos", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  filter === s ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              <Button variant={view === "table" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setView("table")}>
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button variant={view === "cards" ? "secondary" : "ghost"} size="sm" className="h-7 px-2" onClick={() => setView("cards")}>
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filtros</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Nuevo Lead</Button>
          </div>
        </div>

        {view === "table" ? (
          <div className="rounded-2xl border border-border/70 bg-card shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="text-left font-medium px-4 py-3">Lead</th>
                  <th className="text-left font-medium px-4 py-3">Destino</th>
                  <th className="text-left font-medium px-4 py-3">Presupuesto</th>
                  <th className="text-left font-medium px-4 py-3">Pax</th>
                  <th className="text-left font-medium px-4 py-3">Fuente</th>
                  <th className="text-left font-medium px-4 py-3">Estado</th>
                  <th className="text-left font-medium px-4 py-3">Agente</th>
                  <th className="text-left font-medium px-4 py-3">Último contacto</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} onClick={() => setSelected(l)} className="border-b border-border/40 last:border-0 hover:bg-muted/40 cursor-pointer transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-[10px] bg-primary-soft text-primary">{l.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium leading-tight">{l.name}</p>
                          <p className="text-xs text-muted-foreground">{l.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{l.destination}</td>
                    <td className="px-4 py-3 font-semibold">€{l.budget.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.passengers}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="font-normal">{l.source}</Badge></td>
                    <td className="px-4 py-3">{statusBadge(l.status)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.agent}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{l.lastContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((l) => (
              <button key={l.id} onClick={() => setSelected(l)} className="text-left rounded-2xl border border-border/70 bg-card p-4 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">{l.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{l.name}</p>
                      {statusBadge(l.status)}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{l.email}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3 w-3" /> {l.destination}</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3 w-3" /> {l.passengers} pax</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="h-3 w-3" /> {l.travelDate}</div>
                  <div className="flex items-center gap-1.5 font-semibold text-foreground"><DollarSign className="h-3 w-3" /> €{l.budget.toLocaleString()}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {l.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-md p-0 overflow-y-auto">
          {selected && (
            <>
              <div className="bg-gradient-to-br from-primary/15 to-card p-6 border-b border-border">
                <SheetHeader>
                  <SheetTitle className="sr-only">{selected.name}</SheetTitle>
                </SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 ring-4 ring-card shadow-soft"><AvatarFallback className="bg-primary text-white font-semibold">{selected.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</AvatarFallback></Avatar>
                  <div>
                    <h2 className="font-display text-lg font-semibold">{selected.name}</h2>
                    <p className="text-xs text-muted-foreground">{selected.id} · {selected.city}, {selected.country}</p>
                    <div className="mt-1.5">{statusBadge(selected.status)}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Phone className="h-3.5 w-3.5" /> Llamar</Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Button>
                  <Button size="sm" className="flex-1 gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> WhatsApp</Button>
                </div>
              </div>
              <Tabs defaultValue="info" className="px-6 pt-4">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="notes">Notas</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-3 pt-4 pb-6">
                  {[
                    { label: "Email", value: selected.email },
                    { label: "Teléfono", value: selected.phone },
                    { label: "Destino de interés", value: selected.destination },
                    { label: "Presupuesto", value: `€${selected.budget.toLocaleString()}` },
                    { label: "Fecha tentativa", value: selected.travelDate },
                    { label: "Pasajeros", value: String(selected.passengers) },
                    { label: "Fuente", value: selected.source },
                    { label: "Agente asignado", value: selected.agent },
                    { label: "Prioridad", value: selected.priority },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between text-sm border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium text-right">{r.value}</span>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-1 pt-2">{selected.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}</div>
                </TabsContent>
                <TabsContent value="timeline" className="pt-4 pb-6">
                  <ol className="relative border-l border-border ml-2 space-y-4">
                    {[
                      { t: "Llamada realizada", d: "Hace 2 días", a: selected.agent },
                      { t: "Cotización enviada", d: "Hace 5 días", a: selected.agent },
                      { t: "Email de bienvenida", d: "Hace 8 días", a: "Sistema" },
                      { t: "Lead creado", d: selected.createdAt, a: selected.source },
                    ].map((e, i) => (
                      <li key={i} className="ml-4">
                        <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />
                        <p className="text-sm font-medium">{e.t}</p>
                        <p className="text-xs text-muted-foreground">{e.d} · {e.a}</p>
                      </li>
                    ))}
                  </ol>
                </TabsContent>
                <TabsContent value="notes" className="pt-4 pb-6">
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">{selected.notes}</div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
