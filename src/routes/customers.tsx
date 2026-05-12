import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { customers, type Customer } from "@/lib/mock-data";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Crown, Star, Mail, Phone, MapPin, Plane, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Clientes — Voyage CRM" }, { name: "description", content: "Customer 360 — perfil completo del cliente turístico." }] }),
  component: CustomersPage,
});

const tierColors: Record<Customer["tier"], string> = {
  VIP: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-300/40",
  Frecuente: "bg-success/10 text-success border-success/20",
  Nuevo: "bg-info/10 text-info border-info/20",
  Inactivo: "bg-muted text-muted-foreground border-border",
};

function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Topbar title="Clientes" subtitle={`${customers.length} clientes · ${customers.filter(c=>c.tier==="VIP").length} VIP`} />
      <main className="flex-1 p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar cliente…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-card" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => setSelected(c)} className="text-left rounded-2xl bg-card border border-border/70 p-4 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary-soft text-primary text-sm font-semibold">{c.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold truncate">{c.name}</p>
                    <Badge variant="outline" className={cn("text-[10px] gap-0.5", tierColors[c.tier])}>
                      {c.tier === "VIP" && <Crown className="h-2.5 w-2.5" />}
                      {c.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/50">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
                  <p className="font-display font-bold text-sm">€{(c.totalSpent/1000).toFixed(1)}k</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Viajes</p>
                  <p className="font-display font-bold text-sm">{c.trips}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">NPS</p>
                  <p className={cn("font-display font-bold text-sm", c.npsScore && c.npsScore >= 9 ? "text-success" : c.npsScore && c.npsScore >= 7 ? "text-warning-foreground" : "text-destructive")}>{c.npsScore}/10</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-xl p-0 overflow-y-auto">
          {selected && (
            <>
              <div className="bg-gradient-to-br from-primary/15 via-card to-card p-6 border-b border-border">
                <SheetHeader>
                  <SheetTitle className="sr-only">{selected.name}</SheetTitle>
                </SheetHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 ring-4 ring-card shadow-soft">
                    <AvatarFallback className="bg-primary text-white text-base font-semibold">{selected.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-xl font-bold">{selected.name}</h2>
                      <Badge variant="outline" className={cn("gap-0.5", tierColors[selected.tier])}>
                        {selected.tier === "VIP" && <Crown className="h-3 w-3" />}{selected.tier}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{selected.id}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{selected.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{selected.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-5">
                  {[
                    { i: TrendingUp, l: "Valor estimado", v: `€${selected.totalSpent.toLocaleString()}` },
                    { i: Plane, l: "Viajes", v: String(selected.trips) },
                    { i: Star, l: "NPS", v: `${selected.npsScore}/10` },
                    { i: Heart, l: "Fidelización", v: selected.tier === "VIP" ? "Alta" : selected.tier === "Frecuente" ? "Media" : "Baja" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-card border border-border/60 p-2.5 text-center">
                      <s.i className="h-3.5 w-3.5 mx-auto text-primary mb-1" />
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                      <p className="font-display font-bold text-xs">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Tabs defaultValue="historial" className="px-6 pt-4">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="prefs">Preferencias</TabsTrigger>
                  <TabsTrigger value="encuestas">Encuestas</TabsTrigger>
                </TabsList>
                <TabsContent value="historial" className="pt-4 pb-6 space-y-2">
                  {[
                    { d: "2026-03-12", trip: selected.lastTrip, amount: 4200 },
                    { d: "2025-08-04", trip: "Punta Cana", amount: 3800 },
                    { d: "2025-02-22", trip: "Roma", amount: 2900 },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                      <div>
                        <p className="text-sm font-medium">{h.trip}</p>
                        <p className="text-xs text-muted-foreground">{h.d}</p>
                      </div>
                      <p className="font-display font-bold">€{h.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="timeline" className="pt-4 pb-6">
                  <ol className="relative border-l border-border ml-2 space-y-4">
                    {[
                      "Encuesta NPS respondida (10/10)",
                      `Viaje finalizado a ${selected.lastTrip}`,
                      "Cotización aceptada",
                      "Primera consulta",
                    ].map((e, i) => (
                      <li key={i} className="ml-4">
                        <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />
                        <p className="text-sm">{e}</p>
                        <p className="text-xs text-muted-foreground">Hace {(i + 1) * 14} días</p>
                      </li>
                    ))}
                  </ol>
                </TabsContent>
                <TabsContent value="prefs" className="pt-4 pb-6">
                  <div className="flex flex-wrap gap-2">
                    {selected.preferences.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}
                    <Badge variant="outline">+ Agregar</Badge>
                  </div>
                </TabsContent>
                <TabsContent value="encuestas" className="pt-4 pb-6 space-y-2">
                  <div className="rounded-lg border border-border/60 p-3">
                    <p className="text-sm font-medium">Satisfacción Post-Viaje</p>
                    <p className="text-xs text-muted-foreground">Respondida hace 12 días</p>
                    <p className="text-sm mt-1">"Excelente experiencia, repetiré sin duda."</p>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="px-6 pb-6 flex gap-2">
                <Button variant="outline" className="flex-1 gap-1.5"><Mail className="h-4 w-4" />Email</Button>
                <Button className="flex-1 gap-1.5">Crear oportunidad</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
