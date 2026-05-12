// Mock data for Tourism CRM MVP

export type LeadStatus =
  | "Nuevo"
  | "Contactado"
  | "Interesado"
  | "Cotizando"
  | "En seguimiento"
  | "Ganado"
  | "Perdido";

export type Priority = "Alta" | "Media" | "Baja";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  destination: string;
  budget: number;
  travelDate: string;
  passengers: number;
  source: string;
  status: LeadStatus;
  agent: string;
  notes: string;
  tags: string[];
  priority: Priority;
  lastContact: string;
  createdAt: string;
};

export type PipelineStage =
  | "Nuevo Lead"
  | "Contactado"
  | "Cotización Enviada"
  | "Esperando Respuesta"
  | "Pago Pendiente"
  | "Confirmado"
  | "Viaje Finalizado";

export type Deal = {
  id: string;
  client: string;
  destination: string;
  travelDate: string;
  budget: number;
  stage: PipelineStage;
  priority: Priority;
  agent: string;
  lastInteraction: string;
  avatar: string;
};

export type Campaign = {
  id: string;
  name: string;
  type: "WhatsApp" | "Email";
  segment: string;
  status: "Activa" | "Programada" | "Finalizada" | "Borrador";
  sent: number;
  opens: number;
  replies: number;
  conversion: number;
  createdAt: string;
  scheduledAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalSpent: number;
  trips: number;
  lastTrip: string;
  tier: "VIP" | "Frecuente" | "Nuevo" | "Inactivo";
  preferences: string[];
  avatar: string;
  npsScore?: number;
};

export type Survey = {
  id: string;
  title: string;
  type: "Satisfacción" | "NPS" | "Calidad" | "Atención";
  responses: number;
  avgScore: number;
  createdAt: string;
  status: "Activa" | "Cerrada";
};

const agents = ["María González", "Carlos Pérez", "Lucía Ramírez", "Andrés Torres", "Sofía Núñez"];
const destinations = [
  "Cancún, México",
  "Punta Cana, R. Dominicana",
  "París, Francia",
  "Tokio, Japón",
  "Cusco, Perú",
  "Santorini, Grecia",
  "Bali, Indonesia",
  "Roma, Italia",
  "Buenos Aires, Argentina",
  "Cartagena, Colombia",
  "Maldivas",
  "Dubai, EAU",
];
const sources = ["Instagram", "Facebook Ads", "Google Ads", "Referido", "WhatsApp", "Web orgánico", "Feria turística"];
const cities = ["Madrid", "Barcelona", "Lima", "CDMX", "Bogotá", "Buenos Aires", "Santiago", "Quito", "Miami"];
const countries = ["España", "Perú", "México", "Colombia", "Argentina", "Chile", "Ecuador", "EE.UU."];

const firstNames = ["Ana", "Luis", "Carmen", "Diego", "Valentina", "Mateo", "Isabella", "Joaquín", "Camila", "Sebastián", "Lucía", "Pablo", "Renata", "Bruno", "Emilia"];
const lastNames = ["García", "Rodríguez", "Martínez", "López", "Hernández", "Sánchez", "Pérez", "Ramírez", "Torres", "Flores", "Vargas", "Castro"];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }
function rand(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * (max - min)) + min;
}

const statuses: LeadStatus[] = ["Nuevo", "Contactado", "Interesado", "Cotizando", "En seguimiento", "Ganado", "Perdido"];
const priorities: Priority[] = ["Alta", "Media", "Baja"];

export const leads: Lead[] = Array.from({ length: 28 }, (_, i) => {
  const fn = pick(firstNames, i * 3 + 1);
  const ln = pick(lastNames, i * 5 + 2);
  const name = `${fn} ${ln}`;
  return {
    id: `LD-${1000 + i}`,
    name,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@mail.com`,
    phone: `+34 6${rand(i + 1, 10, 99)} ${rand(i + 2, 100, 999)} ${rand(i + 3, 100, 999)}`,
    city: pick(cities, i + 1),
    country: pick(countries, i + 2),
    destination: pick(destinations, i),
    budget: rand(i + 10, 1500, 12000),
    travelDate: `2026-${String(rand(i, 1, 13)).padStart(2, "0")}-${String(rand(i + 7, 1, 28)).padStart(2, "0")}`,
    passengers: rand(i + 4, 1, 6),
    source: pick(sources, i + 1),
    status: pick(statuses, i),
    agent: pick(agents, i),
    notes: "Interesado en paquete todo incluido con vuelos directos.",
    tags: i % 3 === 0 ? ["VIP", "Luna de miel"] : i % 2 === 0 ? ["Familia"] : ["Aventura"],
    priority: pick(priorities, i + 1),
    lastContact: `Hace ${rand(i + 1, 1, 30)} días`,
    createdAt: `2025-${String(rand(i, 1, 12)).padStart(2, "0")}-${String(rand(i + 1, 1, 28)).padStart(2, "0")}`,
  };
});

const stages: PipelineStage[] = [
  "Nuevo Lead",
  "Contactado",
  "Cotización Enviada",
  "Esperando Respuesta",
  "Pago Pendiente",
  "Confirmado",
  "Viaje Finalizado",
];

export const deals: Deal[] = Array.from({ length: 22 }, (_, i) => {
  const fn = pick(firstNames, i * 2 + 5);
  const ln = pick(lastNames, i * 3 + 1);
  return {
    id: `DL-${2000 + i}`,
    client: `${fn} ${ln}`,
    destination: pick(destinations, i + 2),
    travelDate: `2026-${String(rand(i + 4, 1, 13)).padStart(2, "0")}-${String(rand(i + 9, 1, 28)).padStart(2, "0")}`,
    budget: rand(i + 11, 2000, 15000),
    stage: pick(stages, i),
    priority: pick(priorities, i),
    agent: pick(agents, i + 1),
    lastInteraction: `Hace ${rand(i, 1, 14)}d`,
    avatar: `${fn[0]}${ln[0]}`,
  };
});

export const campaigns: Campaign[] = [
  { id: "C1", name: "Verano Caribe 2026", type: "Email", segment: "Clientes frecuentes", status: "Activa", sent: 1240, opens: 812, replies: 96, conversion: 14, createdAt: "2026-04-12" },
  { id: "C2", name: "Promo Luna de Miel", type: "WhatsApp", segment: "Clientes recientes", status: "Activa", sent: 480, opens: 412, replies: 138, conversion: 22, createdAt: "2026-04-28" },
  { id: "C3", name: "Reactivación Inactivos", type: "Email", segment: "Leads inactivos", status: "Programada", sent: 0, opens: 0, replies: 0, conversion: 0, createdAt: "2026-05-08", scheduledAt: "2026-05-20" },
  { id: "C4", name: "Europa Premium VIP", type: "Email", segment: "Clientes VIP", status: "Finalizada", sent: 320, opens: 268, replies: 71, conversion: 31, createdAt: "2026-03-02" },
  { id: "C5", name: "Asia Exótica", type: "WhatsApp", segment: "Clientes por destino", status: "Borrador", sent: 0, opens: 0, replies: 0, conversion: 0, createdAt: "2026-05-10" },
  { id: "C6", name: "Black Friday Travel", type: "Email", segment: "Clientes frecuentes", status: "Finalizada", sent: 2100, opens: 1390, replies: 184, conversion: 18, createdAt: "2025-11-20" },
];

export const customers: Customer[] = Array.from({ length: 18 }, (_, i) => {
  const fn = pick(firstNames, i + 3);
  const ln = pick(lastNames, i + 7);
  const tiers: Customer["tier"][] = ["VIP", "Frecuente", "Nuevo", "Inactivo"];
  return {
    id: `CL-${3000 + i}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}${i}@mail.com`,
    phone: `+34 6${rand(i + 5, 10, 99)} ${rand(i + 6, 100, 999)} ${rand(i + 7, 100, 999)}`,
    city: pick(cities, i),
    totalSpent: rand(i + 20, 2500, 38000),
    trips: rand(i + 3, 1, 12),
    lastTrip: pick(destinations, i + 1),
    tier: pick(tiers, i),
    preferences: i % 2 === 0 ? ["Playa", "Todo incluido"] : ["Cultura", "Boutique"],
    avatar: `${fn[0]}${ln[0]}`,
    npsScore: rand(i + 8, 6, 11),
  };
});

export const surveys: Survey[] = [
  { id: "S1", title: "Satisfacción Post-Viaje Caribe", type: "Satisfacción", responses: 124, avgScore: 4.6, createdAt: "2026-04-10", status: "Activa" },
  { id: "S2", title: "NPS Global Q2", type: "NPS", responses: 312, avgScore: 8.4, createdAt: "2026-04-01", status: "Activa" },
  { id: "S3", title: "Calidad servicio Europa", type: "Calidad", responses: 86, avgScore: 4.3, createdAt: "2026-03-22", status: "Cerrada" },
  { id: "S4", title: "Atención del Asesor", type: "Atención", responses: 198, avgScore: 4.7, createdAt: "2026-03-15", status: "Activa" },
];

export const recentComments = [
  { name: "Ana Vargas", text: "El asesor fue excepcional, todo perfecto en Cancún.", score: 10 },
  { name: "Luis Castro", text: "El hotel no cumplió expectativas, pero la atención fue muy buena.", score: 7 },
  { name: "Carmen Ruiz", text: "Repetiré sin duda. Bali superó todo.", score: 10 },
  { name: "Diego Flores", text: "Excelente coordinación, solo el vuelo tuvo demoras.", score: 8 },
];

// Reports / Analytics
export const monthlySales = [
  { month: "Ene", sales: 42000, deals: 18 },
  { month: "Feb", sales: 51000, deals: 22 },
  { month: "Mar", sales: 68000, deals: 31 },
  { month: "Abr", sales: 74000, deals: 34 },
  { month: "May", sales: 89000, deals: 41 },
  { month: "Jun", sales: 102000, deals: 47 },
];

export const conversionFunnel = [
  { stage: "Leads", value: 1240 },
  { stage: "Contactados", value: 890 },
  { stage: "Cotizados", value: 520 },
  { stage: "Negociando", value: 280 },
  { stage: "Ganados", value: 142 },
];

export const sourceData = [
  { name: "Instagram", value: 32 },
  { name: "Google Ads", value: 24 },
  { name: "Referidos", value: 18 },
  { name: "Facebook", value: 14 },
  { name: "Web", value: 12 },
];

export const topDestinations = [
  { destination: "Cancún", sales: 142000 },
  { destination: "Punta Cana", sales: 118000 },
  { destination: "París", sales: 96000 },
  { destination: "Bali", sales: 84000 },
  { destination: "Tokio", sales: 72000 },
  { destination: "Santorini", sales: 64000 },
];

export const agentPerformance = agents.map((a, i) => ({
  agent: a,
  deals: rand(i + 11, 12, 48),
  revenue: rand(i + 22, 35000, 120000),
  conversion: rand(i + 33, 18, 42),
}));

export const stageColors: Record<PipelineStage, string> = {
  "Nuevo Lead": "oklch(0.65 0.14 240)",
  "Contactado": "oklch(0.62 0.18 320)",
  "Cotización Enviada": "oklch(0.78 0.16 75)",
  "Esperando Respuesta": "oklch(0.7 0.13 60)",
  "Pago Pendiente": "oklch(0.65 0.18 30)",
  "Confirmado": "oklch(0.62 0.16 155)",
  "Viaje Finalizado": "oklch(0.55 0.05 250)",
};

export const statusColors: Record<LeadStatus, string> = {
  "Nuevo": "info",
  "Contactado": "secondary",
  "Interesado": "warning",
  "Cotizando": "warning",
  "En seguimiento": "info",
  "Ganado": "success",
  "Perdido": "destructive",
};

export const PIPELINE_STAGES = stages;
