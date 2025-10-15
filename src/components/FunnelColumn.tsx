import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FunnelStage, STAGE_LABELS, StageName } from '@/types/funnel';

interface FunnelColumnProps {
  title: string;
  stages: FunnelStage[];
  color?: string; // pode ser cor sólida ex.: bg-[#03045E] ou gradiente ex.: bg-gradient-to-b from-[#0047CC] to-[#03045E]
  showTotalLeads?: boolean;
}

export function FunnelColumn({ title, stages, color = 'bg-blue', showTotalLeads = false }: FunnelColumnProps) {
  const stageOrder: StageName[] = [
    'em_contato',
    'reunioes',
    'follow_up',
    'propostas',
    'negociacoes',
    'contratos',
    'contratos_assinados',
    'oportunidades_perdidas',
    'oportunidades_vencidas',
  ];

  const orderedStages = stageOrder.map(stageName => 
    stages.find(s => s.stage_name === stageName)
  ).filter(Boolean) as FunnelStage[];

  const maxCount = orderedStages.reduce((max, s) => Math.max(max, s.lead_count), 0);

  const totalLeads = orderedStages.reduce((sum, s) => sum + s.lead_count, 0);

  return (
    <Card className="h-fit">
      <CardHeader className={`${color} text-white rounded-t-xl`}>
        <div className="flex flex-col items-center py-2">
          <CardTitle className="text-center">{title}</CardTitle>
          {showTotalLeads && (
            <>
              <span className="text-4xl font-extrabold mt-2">{totalLeads}</span>
              <span className="text-xs mt-1 tracking-wide uppercase">Total de Leads</span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {orderedStages.map((stage) => (
          <div
            key={stage.id}
            className="bg-secondary rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{STAGE_LABELS[stage.stage_name]}</span>
              <span className="text-lg font-bold text-primary">{stage.lead_count}</span>
            </div>
            <Progress 
              value={maxCount ? (stage.lead_count / maxCount) * 100 : 0} 
              indicatorClassName={color}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
