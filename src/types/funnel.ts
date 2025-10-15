export type FunnelType = 'eventos' | 'ads' | 'outbound' | 'parceiros' | 'indicados';

export type StageName = 
  | 'em_contato' 
  | 'reunioes' 
  | 'follow_up' 
  | 'propostas' 
  | 'negociacoes' 
  | 'contratos' 
  | 'contratos_assinados' 
  | 'oportunidades_perdidas' 
  | 'oportunidades_vencidas';

export interface FunnelStage {
  id: string;
  funnel_id: string;
  stage_name: StageName;
  lead_count: number;
  total_value: number;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Funnel {
  id: string;
  name: string;
  type: FunnelType;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  funnel_id: string;
  report_date: string;
  conversion_rate: number;
  closed_revenue: number;
  total_pipeline: number;
  average_ticket: number;
  created_at: string;
}

export const STAGE_LABELS: Record<StageName, string> = {
  em_contato: 'Em Contato',
  reunioes: 'Reuniões',
  follow_up: 'Follow-Up',
  propostas: 'Propostas',
  negociacoes: 'Negociações',
  contratos: 'Contratos',
  contratos_assinados: 'Contratos Assinados',
  oportunidades_perdidas: 'Oportunidades Perdidas',
  oportunidades_vencidas: 'Oportunidades Vencidas',
};

export const FINANCIAL_STAGES: StageName[] = [
  'negociacoes',
  'contratos',
  'contratos_assinados',
  'oportunidades_vencidas',
  'oportunidades_perdidas',
];
