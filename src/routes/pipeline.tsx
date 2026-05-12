import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { deals as initialDeals, PIPELINE_STAGES, stageColors, type Deal, type PipelineStage } from "@/lib/mock-data";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Flame, MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Voyage CRM" }, { name: "description", content: "Pipeline visual de ventas turísticas tipo Kanban." }] }),
  component: PipelinePage,
});

const priorityColor = {
  Alta: "text-destructive bg-destructive/10",
  Media: "text-warning-foreground bg-warning/20",
  Baja: "text-muted-foreground bg-muted",
};

function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [dragId, setDragId] = useState<string | null>(null);

  const onDrop = (stage: PipelineStage) => {
    if (!dragId) return;
    setDeals((prev) => prev.map((d) => (d.id === dragId ? { ...d, stage } : d)));
    setDragId(null);
  };

  const totalValue = (stage: PipelineStage) =>
    deals.filter((d) => d.stage === stage).reduce((s, d) => s + d.budget, 0);

  return (
    <>
      <Topbar title="Pipeline" subtitle={`${deals.length} oportunidades · €${deals.reduce((s,d)=>s+d.budget,0).toLocaleString()} en pipeline`} />
      <main className="flex-1 p-4 md:p-6 overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-4">
          {PIPELINE_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(stage)}
                className="w-[280px] shrink-0 rounded-2xl bg-muted/40 border border-border/60 flex flex-col max-h-[calc(100vh-9rem)]"
              >
                <div className="px-3 py-3 border-b border-border/60 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: stageColors[stage] }} />
                  <h3 className="font-display text-sm font-semibold flex-1 truncate">{stage}</h3>
                  <Badge variant="secondary" className="bg-card text-xs h-5">{stageDeals.length}</Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>
                </div>
                <div className="px-3 py-2 text-[11px] text-muted-foreground border-b border-border/60">
                  €{totalValue(stage).toLocaleString()}
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {stageDeals.map((d) => (
                    <div
                      key={d.id}
                      draggable
                      onDragStart={() => setDragId(d.id)}
                      className={cn(
                        "group rounded-xl bg-card border border-border/70 p-3 shadow-soft cursor-grab active:cursor-grabbing hover:shadow-elevated hover:-translate-y-0.5 transition",
                        dragId === d.id && "opacity-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{d.client}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{d.destination}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-base">€{d.budget.toLocaleString()}</span>
                        <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium", priorityColor[d.priority])}>
                          {d.priority === "Alta" && <Flame className="h-2.5 w-2.5" />}
                          {d.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{d.travelDate}</span>
                        <span>{d.lastInteraction}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-1.5">
                        <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px] bg-primary-soft text-primary">{d.agent.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                        <span className="text-[11px] text-muted-foreground truncate">{d.agent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
