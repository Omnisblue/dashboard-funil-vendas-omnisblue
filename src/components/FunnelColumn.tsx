import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelStage, STAGE_LABELS, StageName } from '@/types/funnel';

interface FunnelColumnProps {
  title: string;
  stages: FunnelStage[];
  color?: string;
}

export function FunnelColumn({ title, stages, color = 'bg-blue' }: FunnelColumnProps) {
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

  return (
    <Card className="h-fit">
      <CardHeader className={`${color} text-white rounded-t-xl`}>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {orderedStages.map((stage) => (
          <div
            key={stage.id}
            className="bg-secondary rounded-lg p-4 flex justify-between items-center"
          >
            <span className="text-sm font-medium">{STAGE_LABELS[stage.stage_name]}</span>
            <span className="text-lg font-bold text-primary">{stage.lead_count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
