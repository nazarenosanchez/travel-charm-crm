import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Mail, MessageSquare, Sparkles, Users, Calendar, Send,
  Target, Image as ImageIcon, Smile, Paperclip, Bold, Italic, Link2,
  Eye, Save, Rocket, ChevronRight, Globe, Clock, Filter, CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/campaigns/new")({
  head: () => ({
    meta: [
      { title: "Nueva campaña — Voyage CRM" },
      { name: "description", content: "Diseña, segmenta y programa tu campaña comercial." },
    ],
  }),
  component: NewCampaignPage,
});

const segments = [
  { id: "vip", name: "Clientes VIP", count: 248, desc: "Ticket promedio > €5.000" },
  { id: "frec", name: "Clientes frecuentes", count: 1320, desc: "Han viajado 2+ veces" },
  { id: "rec", name: "Clientes recientes", count: 612, desc: "Última compra < 90 días" },
  { id: "leads", name: "Leads cotizados", count: 480, desc: "Recibieron cotización" },
  { id: "inact", name: "Inactivos", count: 1840, desc: "Sin actividad > 6 meses" },
];

const destinations = ["Caribe", "Europa", "Asia", "Sudamérica", "Norteamérica", "África", "Oceanía"];
const templates = [
  { id: "t1", name: "Lanzamiento promo", desc: "Anuncio con CTA fuerte y urgencia" },
  { id: "t2", name: "Reactivación", desc: "Reencantar clientes inactivos" },
  { id: "t3", name: "Newsletter mensual", desc: "Novedades + destinos top" },
  { id: "t4", name: "Felicitación cumpleaños", desc: "Mensaje personal + cupón" },
];

function NewCampaignPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<"Email" | "WhatsApp">("Email");
  const [name, setName] = useState("Promo Verano Caribe 2026");
  const [subject, setSubject] = useState("✈️ Tu próximo viaje al Caribe — hasta 30% OFF");
  const [preheader, setPreheader] = useState("Salidas garantizadas · Cupos limitados");
  const [body, setBody] = useState(
    "Hola {{nombre}},\n\nTenemos una selección exclusiva de paquetes al Caribe con beneficios solo para ti:\n\n• Vuelos directos incluidos\n• Resort 5★ todo incluido\n• Hasta 30% de descuento\n\nReserva antes del 30 de junio.",
  );
  const [segment, setSegment] = useState("vip");
  const [destFilter, setDestFilter] = useState<string[]>(["Caribe"]);
  const [sendNow, setSendNow] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-06-15");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [abTest, setAbTest] = useState(false);

  const selectedSegment = segments.find((s) => s.id === segment)!;
  const estimatedReach = useMemo(() => {
    const base = selectedSegment.count;
    const factor = destFilter.length ? 0.55 : 1;
    return Math.round(base * factor);
  }, [selectedSegment, destFilter]);

  const steps = [
    { n: 1, label: "Detalles" },
    { n: 2, label: "Audiencia" },
    { n: 3, label: "Contenido" },
    { n: 4, label: "Programación" },
  ];

  const toggleDest = (d: string) =>
    setDestFilter((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const handleLaunch = () => {
    toast.success("Campaña lista", { description: sendNow ? "Se enviará en unos minutos." : `Programada para ${scheduleDate} ${scheduleTime}.` });
    navigate({ to: "/campaigns" });
  };

  return (
    <>
      <Topbar title="Nueva campaña" subtitle="Diseña, segmenta y programa tu próxima campaña comercial" />
      <main className="flex-1 p-4 md:p-6">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/campaigns"><ArrowLeft className="h-4 w-4" />Campañas</Link>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Borrador</span>
              <span className="text-muted-foreground/50">·</span>
              <span className="font-medium">{name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5"><Eye className="h-4 w-4" />Previsualizar</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Save className="h-4 w-4" />Guardar borrador</Button>
            <Button size="sm" className="gap-1.5" onClick={handleLaunch}>
              <Rocket className="h-4 w-4" />{sendNow ? "Enviar ahora" : "Programar"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          {/* Main column */}
          <div className="space-y-5">
            {/* Stepper */}
            <div className="rounded-2xl bg-card border border-border/70 p-2 shadow-soft">
              <div className="flex items-center">
                {steps.map((s, i) => {
                  const active = step === s.n;
                  const done = step > s.n;
                  return (
                    <button
                      key={s.n}
                      onClick={() => setStep(s.n)}
                      className={cn(
                        "flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition text-left",
                        active && "bg-primary-soft",
                      )}
                    >
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border",
                          done && "bg-success text-success-foreground border-success",
                          active && "gradient-primary text-primary-foreground border-transparent shadow-glow",
                          !active && !done && "bg-muted text-muted-foreground border-border",
                        )}
                      >
                        {done ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                      </div>
                      <div className="hidden sm:block">
                        <p className={cn("text-[10px] uppercase tracking-wider", active ? "text-primary" : "text-muted-foreground")}>Paso {s.n}</p>
                        <p className="text-xs font-semibold leading-tight">{s.label}</p>
                      </div>
                      {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground/50 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step content */}
            {step === 1 && (
              <section className="rounded-2xl bg-card border border-border/70 p-6 shadow-soft space-y-6">
                <div>
                  <h2 className="font-display text-lg font-semibold">Detalles de la campaña</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Define el tipo, objetivo y nombre interno</p>
                </div>

                <div className="space-y-2">
                  <Label>Canal</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: "Email", icon: Mail, desc: "Newsletter, promos y comunicados", color: "text-info bg-info/10" },
                      { v: "WhatsApp", icon: MessageSquare, desc: "Mensajes directos y conversacionales", color: "text-success bg-success/10" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setType(opt.v as "Email" | "WhatsApp")}
                        className={cn(
                          "relative rounded-xl border p-4 text-left transition",
                          type === opt.v ? "border-primary bg-primary-soft/40 shadow-glow" : "border-border hover:border-primary/40 bg-card",
                        )}
                      >
                        <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center mb-2", opt.color)}>
                          <opt.icon className="h-4.5 w-4.5" />
                        </div>
                        <p className="font-semibold text-sm">{opt.v}</p>
                        <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                        {type === opt.v && (
                          <CheckCircle2 className="h-4 w-4 text-primary absolute top-3 right-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de campaña</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <p className="text-[11px] text-muted-foreground">Solo visible internamente</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Objetivo</Label>
                    <Select defaultValue="conv">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conv">Conversión / ventas</SelectItem>
                        <SelectItem value="react">Reactivación</SelectItem>
                        <SelectItem value="loyal">Fidelización</SelectItem>
                        <SelectItem value="aware">Awareness / branding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">Plantilla base</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {templates.map((t) => (
                      <button key={t.id} className="rounded-xl border border-border hover:border-primary/50 bg-muted/30 hover:bg-primary-soft/30 p-3 text-left transition group">
                        <div className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center mb-2 group-hover:border-primary/40">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-xs font-semibold leading-tight">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} className="gap-1.5">Siguiente<ChevronRight className="h-4 w-4" /></Button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="rounded-2xl bg-card border border-border/70 p-6 shadow-soft space-y-6">
                <div>
                  <h2 className="font-display text-lg font-semibold">Audiencia & segmentación</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Elige a quién impactar</p>
                </div>

                <div className="space-y-2">
                  <Label>Segmento</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {segments.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSegment(s.id)}
                        className={cn(
                          "rounded-xl border p-3.5 text-left transition flex items-center gap-3",
                          segment === s.id ? "border-primary bg-primary-soft/40" : "border-border hover:border-primary/40",
                        )}
                      >
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", segment === s.id ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                          <Users className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">{s.name}</p>
                            <span className="text-[11px] font-mono text-muted-foreground">{s.count.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{s.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Label className="m-0">Filtros adicionales — Destino de interés</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {destinations.map((d) => {
                      const active = destFilter.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggleDest(d)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                            active ? "gradient-primary text-primary-foreground border-transparent" : "border-border hover:border-primary/40 text-muted-foreground",
                          )}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Audiencia estimada</p>
                      <p className="font-display text-xl font-bold">{estimatedReach.toLocaleString()} contactos</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-card">{selectedSegment.name}</Badge>
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
                  <Button onClick={() => setStep(3)} className="gap-1.5">Siguiente<ChevronRight className="h-4 w-4" /></Button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="rounded-2xl bg-card border border-border/70 p-6 shadow-soft space-y-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Contenido</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Redacta el mensaje. Usa <code className="px-1 py-0.5 rounded bg-muted text-[11px]">{"{{nombre}}"}</code> para personalizar.</p>
                </div>

                {type === "Email" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Asunto</Label>
                        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Preheader</Label>
                        <Input value={preheader} onChange={(e) => setPreheader(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Remitente</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input defaultValue="Voyage Travel" />
                        <Input defaultValue="hola@voyage.travel" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Mensaje</Label>
                    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
                      {[Bold, Italic, Link2, ImageIcon, Smile, Paperclip].map((Icon, i) => (
                        <Button key={i} variant="ghost" size="icon" className="h-7 w-7"><Icon className="h-3.5 w-3.5" /></Button>
                      ))}
                    </div>
                  </div>
                  <Textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} className="font-mono text-sm" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{body.length} caracteres</span>
                    <button className="inline-flex items-center gap-1 text-primary hover:underline">
                      <Sparkles className="h-3 w-3" />Mejorar con IA
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Test A/B</p>
                      <p className="text-[11px] text-muted-foreground">Prueba 2 asuntos y envía el ganador</p>
                    </div>
                  </div>
                  <Switch checked={abTest} onCheckedChange={setAbTest} />
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
                  <Button onClick={() => setStep(4)} className="gap-1.5">Siguiente<ChevronRight className="h-4 w-4" /></Button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="rounded-2xl bg-card border border-border/70 p-6 shadow-soft space-y-6">
                <div>
                  <h2 className="font-display text-lg font-semibold">Programación & envío</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Cuándo y cómo se enviará</p>
                </div>

                <Tabs value={sendNow ? "now" : "schedule"} onValueChange={(v) => setSendNow(v === "now")}>
                  <TabsList className="grid grid-cols-2 w-full max-w-md">
                    <TabsTrigger value="schedule" className="gap-1.5"><Clock className="h-3.5 w-3.5" />Programar</TabsTrigger>
                    <TabsTrigger value="now" className="gap-1.5"><Send className="h-3.5 w-3.5" />Enviar ahora</TabsTrigger>
                  </TabsList>
                  <TabsContent value="schedule" className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Zona horaria</Label>
                      <Select defaultValue="madrid">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="madrid">Europa/Madrid (GMT+2)</SelectItem>
                          <SelectItem value="lima">América/Lima (GMT-5)</SelectItem>
                          <SelectItem value="cdmx">América/CDMX (GMT-6)</SelectItem>
                          <SelectItem value="ba">América/Buenos Aires (GMT-3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="now" className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground">
                    La campaña comenzará a enviarse inmediatamente tras confirmar.
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="space-y-3">
                  <Label>Tracking</Label>
                  {[
                    { l: "Tracking de aperturas", d: "Pixel invisible para medir vistas", v: trackOpens, s: setTrackOpens },
                    { l: "Tracking de clics", d: "Reescribe links para medir CTR", v: trackClicks, s: setTrackClicks },
                  ].map((t) => (
                    <div key={t.l} className="flex items-center justify-between rounded-xl border border-border p-3.5">
                      <div>
                        <p className="text-sm font-medium">{t.l}</p>
                        <p className="text-[11px] text-muted-foreground">{t.d}</p>
                      </div>
                      <Switch checked={t.v} onCheckedChange={t.s} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(3)}>Atrás</Button>
                  <Button onClick={handleLaunch} className="gap-1.5"><Rocket className="h-4 w-4" />{sendNow ? "Enviar ahora" : "Programar campaña"}</Button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar preview */}
          <aside className="space-y-4 lg:sticky lg:top-4 self-start">
            <div className="rounded-2xl bg-card border border-border/70 shadow-soft overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{type}</Badge>
              </div>

              {type === "Email" ? (
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">VT</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate">Voyage Travel</p>
                      <p className="text-[10px] text-muted-foreground truncate">hola@voyage.travel</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug line-clamp-2">{subject}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{preheader}</p>
                  </div>
                  <Separator />
                  <div className="text-xs whitespace-pre-line text-foreground/80 leading-relaxed max-h-64 overflow-auto scroll-fade-mask pr-1">
                    {body}
                  </div>
                  <Button size="sm" className="w-full gradient-primary text-primary-foreground">Reservar ahora</Button>
                </div>
              ) : (
                <div className="p-4 bg-[oklch(0.95_0.02_150)]">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[oklch(0.88_0.08_150)] p-3 shadow-soft">
                    <p className="text-xs whitespace-pre-line text-foreground leading-relaxed">{body}</p>
                    <p className="text-[10px] text-muted-foreground text-right mt-1">12:04 ✓✓</p>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-card border border-border/70 p-4 shadow-soft space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resumen</p>
              {[
                { icon: Globe, l: "Canal", v: type },
                { icon: Users, l: "Segmento", v: selectedSegment.name },
                { icon: Target, l: "Alcance", v: `${estimatedReach.toLocaleString()} contactos` },
                { icon: Calendar, l: "Envío", v: sendNow ? "Inmediato" : `${scheduleDate} · ${scheduleTime}` },
              ].map((r) => (
                <div key={r.l} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <r.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                    <p className="text-xs font-semibold truncate">{r.v}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold">Consejo IA</p>
              </div>
              <p className="text-[11px] text-foreground/70 leading-relaxed">
                Las campañas enviadas martes o jueves a las 10:00 obtienen +18% de apertura en tu industria.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
