import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelStage, STAGE_LABELS, StageName } from '@/types/funnel';

interface EventFunnelColumnProps {
  title: string;
  stages: FunnelStage[];
  headerFrom: string; // e.g., 'from-[#0047CC]'
  headerTo: string;   // e.g., 'to-[#03045E]'
  baseColorHex?: string; // e.g., '#03045E'
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function EventFunnelColumn({
  title,
  stages,
  headerFrom,
  headerTo,
  baseColorHex = '#03045E',
}: EventFunnelColumnProps) {
  const stageOrder: StageName[] = [
    'leads_qualificados' as StageName,
    'reunioes' as StageName,
    'follow_up' as StageName,
    'propostas' as StageName,
    'negociacoes' as StageName,
    'contratos' as StageName,
    'contratos_assinados' as StageName,
    'oportunidades_vencidas' as StageName,
    'oportunidades_perdidas' as StageName,
  ];

  const orderedStages = stageOrder
    .map(stageName => stages.find(s => s.stage_name === stageName))
    .filter(Boolean) as FunnelStage[];

  const totalLeads = orderedStages.reduce((sum, s) => sum + s.lead_count, 0);
  const { r, g, b } = hexToRgb(baseColorHex);

  return (
    <Card className="h-fit">
      <CardHeader className={`bg-gradient-to-b ${headerFrom} ${headerTo} text-white rounded-t-xl py-4`}>
        <CardTitle className="flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold">{totalLeads}</span>
          <span className="text-xs mt-1 tracking-wide uppercase">Total de Leads</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {orderedStages.map((stage, idx) => {
          const alpha = 0.25 + Math.min(idx * 0.06, 0.5);
          const bg = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
          return (
            <div key={stage.id} className="flex items-center justify-between">
              <div className="flex-1 rounded-md px-3 py-2" style={{ backgroundColor: bg }}>
                <span className="text-white text-sm font-medium">{STAGE_LABELS[stage.stage_name]}</span>
              </div>
              <div className="ml-3 px-3 py-2 rounded-md border bg-white shadow-sm" style={{ color: baseColorHex }}>
                <span className="font-bold">{stage.lead_count}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}