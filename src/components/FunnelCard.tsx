import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FunnelType, FunnelStage } from '@/types/funnel';
import { useFunnelData } from '@/hooks/useFunnelData';

interface FunnelCardProps {
  title: string;
  type: FunnelType;
  className?: string;
  titleClassName?: string; // ex.: text-[#D0006F]
  accentBgClass?: string;  // ex.: bg-[#D0006F]
}

export function FunnelCard({ title, type, className, titleClassName, accentBgClass }: FunnelCardProps) {
  const navigate = useNavigate();

  const { data, isLoading } = useFunnelData(type);

  const calculateMetrics = (stages: FunnelStage[]) => {
    const firstStage = stages.find(s => s.stage_name === 'em_contato');
    const closedStages = stages.filter(s => 
      s.stage_name === 'contratos' || s.stage_name === 'contratos_assinados'
    );
    const totalClosed = closedStages.reduce((sum, stage) => sum + stage.lead_count, 0);
    const closedRevenue = closedStages.reduce((sum, stage) => sum + Number(stage.total_value), 0);
    const totalPipeline = stages.reduce((sum, stage) => sum + Number(stage.total_value), 0);
    const conversionRate = firstStage ? (totalClosed / firstStage.lead_count) * 100 : 0;
    const averageTicket = totalClosed > 0 ? closedRevenue / totalClosed : 0;
    return { conversionRate, closedRevenue, totalPipeline, averageTicket };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metrics = data ? calculateMetrics(data.stages) : undefined;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${className}`}
      onClick={() => navigate(`/funil/${type}`)}
    >
      <CardContent className="p-8">
        {/* faixa superior para identificação por cor */}
        {accentBgClass && (
          <div className={`${accentBgClass} h-2 w-full rounded-full mb-6`} />
        )}
        <div className="flex flex-col items-center text-center gap-2">
          <h3 className={`text-2xl font-semibold ${titleClassName || 'text-primary'}`}>{title}</h3>
          <p className="text-muted-foreground">Clique para ver detalhes do funil</p>
          <ArrowRight className={`h-6 w-6 ${titleClassName || 'text-primary'}`} />
        </div>

        {/* Métricas compactas */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {isLoading ? (
            <>
              <div className="animate-pulse h-16 rounded bg-secondary" />
              <div className="animate-pulse h-16 rounded bg-secondary" />
              <div className="animate-pulse h-16 rounded bg-secondary" />
              <div className="animate-pulse h-16 rounded bg-secondary" />
            </>
          ) : metrics ? (
            <>
              <div className="bg-white rounded-lg p-3 border">
                <p className={`text-lg font-bold ${titleClassName || 'text-primary'}`}>{metrics.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Conversão</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <p className={`text-lg font-bold ${titleClassName || 'text-primary'}`}>{formatCurrency(metrics.closedRevenue)}</p>
                <p className="text-xs text-muted-foreground">Receita</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <p className={`text-lg font-bold ${titleClassName || 'text-primary'}`}>{formatCurrency(metrics.totalPipeline)}</p>
                <p className="text-xs text-muted-foreground">Pipeline</p>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <p className={`text-lg font-bold ${titleClassName || 'text-primary'}`}>{formatCurrency(metrics.averageTicket)}</p>
                <p className="text-xs text-muted-foreground">Ticket</p>
              </div>
            </>
          ) : (
            <div className="col-span-2 md:col-span-4 text-sm text-muted-foreground">Sem dados disponíveis</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
