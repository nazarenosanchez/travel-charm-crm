import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { campaigns } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Plus, MoreHorizontal, TrendingUp, Eye, Reply, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/campaigns")({
  head: () => ({ meta: [{ title: "Campañas — Voyage CRM" }, { name: "description", content: "Crea campañas WhatsApp y Email segmentadas." }] }),
  component: CampaignsPage,
});

const statusStyles: Record<string, string> = {
  "Activa": "bg-success/10 text-success border-success/20",
  "Programada": "bg-info/10 text-info border-info/20",
  "Finalizada": "bg-muted text-muted-foreground border-border",
  "Borrador": "bg-warning/15 text-warning-foreground border-warning/30",
};

function CampaignsPage() {
  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalOpens = campaigns.reduce((s, c) => s + c.opens, 0);
  const totalReplies = campaigns.reduce((s, c) => s + c.replies, 0);
  const avgConv = Math.round(campaigns.filter(c=>c.sent>0).reduce((s,c)=>s+c.conversion,0) / campaigns.filter(c=>c.sent>0).length);

  return (
    <>
      <Topbar title="Campañas" subtitle={`${campaigns.length} campañas · ${campaigns.filter(c=>c.status==="Activa").length} activas`} />
      <main className="flex-1 p-4 md:p-6 space-y-5">
        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Enviados", value: totalSent.toLocaleString(), icon: Send, color: "text-primary bg-primary-soft" },
            { label: "Aperturas", value: `${Math.round(totalOpens/totalSent*100)}%`, icon: Eye, color: "text-info bg-info/10" },
            { label: "Respuestas", value: totalReplies.toLocaleString(), icon: Reply, color: "text-warning-foreground bg-warning/20" },
            { label: "Conversión avg", value: `${avgConv}%`, icon: TrendingUp, color: "text-success bg-success/10" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border/70 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", s.color)}><s.icon className="h-4 w-4" /></div>
              </div>
              <p className="mt-2 font-display text-xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Mis campañas</h2>
            <p className="text-xs text-muted-foreground">Crea, programa y monitoriza tus campañas comerciales</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Plantilla</Button>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Nueva campaña</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => {
            const Icon = c.type === "Email" ? Mail : MessageSquare;
            const openRate = c.sent ? Math.round((c.opens / c.sent) * 100) : 0;
            return (
              <div key={c.id} className="group relative rounded-2xl bg-card border border-border/70 p-5 shadow-soft hover:shadow-elevated transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", c.type === "Email" ? "bg-info/10 text-info" : "bg-success/10 text-success")}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-display font-semibold leading-tight">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{c.type} · {c.segment}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={cn("font-medium", statusStyles[c.status])}>{c.status}</Badge>
                  <span className="text-[11px] text-muted-foreground">{c.scheduledAt ? `Programada para ${c.scheduledAt}` : c.createdAt}</span>
                </div>
                {c.sent > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div className="rounded-lg bg-muted/40 p-2">
                        <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Enviados</p>
                        <p className="font-display font-bold text-sm">{c.sent.toLocaleString()}</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-2">
                        <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Aperturas</p>
                        <p className="font-display font-bold text-sm">{openRate}%</p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-2">
                        <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Conv.</p>
                        <p className="font-display font-bold text-sm text-success">{c.conversion}%</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full gradient-primary" style={{ width: `${openRate}%` }} />
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Sin métricas todavía</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
