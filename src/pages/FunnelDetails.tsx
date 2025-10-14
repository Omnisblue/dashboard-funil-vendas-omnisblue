import { useParams } from 'react-router-dom';
import { useFunnelData } from '@/hooks/useFunnelData';
import { DashboardHeader } from '@/components/DashboardHeader';
import { FunnelColumn } from '@/components/FunnelColumn';
import { FinancialSummaryTable } from '@/components/FinancialSummaryTable';
import { PerformanceMetrics } from '@/components/PerformanceMetrics';
import { FunnelType, StageName } from '@/types/funnel';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function FunnelDetails() {
  const { type } = useParams<{ type: FunnelType }>();
  const { data, isLoading } = useFunnelData(type!);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  if (!data) return null;

  const { funnel, stages } = data;

  const calculateMetrics = () => {
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

  const metrics = calculateMetrics();

  const handleGenerateReport = async () => {
    try {
      const { error } = await supabase.from('reports').insert({
        funnel_id: funnel.id,
        conversion_rate: metrics.conversionRate,
        closed_revenue: metrics.closedRevenue,
        total_pipeline: metrics.totalPipeline,
        average_ticket: metrics.averageTicket,
      });

      if (error) throw error;

      toast({
        title: 'Relatório gerado com sucesso!',
        description: 'O novo relatório foi salvo no histórico.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao gerar relatório',
        description: 'Não foi possível salvar o relatório.',
        variant: 'destructive',
      });
    }
  };

  const renderFunnelColumns = () => {
    const groupedBySource = stages.reduce((acc, stage) => {
      const source = stage.source || 'default';
      if (!acc[source]) acc[source] = [];
      acc[source].push(stage);
      return acc;
    }, {} as Record<string, typeof stages>);

    const sources = Object.keys(groupedBySource);

    switch (type) {
      case 'eventos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FunnelColumn 
              title="Evento A" 
              stages={groupedBySource['evento_a'] || []} 
              color="bg-blue"
            />
            <FunnelColumn 
              title="Evento B" 
              stages={groupedBySource['evento_b'] || []} 
              color="bg-cyan"
            />
            <FunnelColumn 
              title="Total" 
              stages={calculateTotalStages(stages)} 
              color="bg-primary"
            />
          </div>
        );

      case 'ads':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FunnelColumn 
              title="Meta" 
              stages={groupedBySource['meta'] || []} 
              color="bg-blue"
            />
            <FunnelColumn 
              title="Google" 
              stages={groupedBySource['google'] || []} 
              color="bg-cyan"
            />
            <FunnelColumn 
              title="Total" 
              stages={calculateTotalStages(stages)} 
              color="bg-primary"
            />
          </div>
        );

      case 'outbound':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FunnelColumn 
                title="Cold E-mail" 
                stages={groupedBySource['cold_email'] || []} 
                color="bg-blue"
              />
              <FunnelColumn 
                title="Cold Call" 
                stages={groupedBySource['cold_call'] || []} 
                color="bg-cyan"
              />
              <FunnelColumn 
                title="LinkedIn" 
                stages={groupedBySource['linkedin'] || []} 
                color="bg-violet"
              />
            </div>
            <FunnelColumn 
              title="Total Outbound" 
              stages={calculateTotalStages(stages)} 
              color="bg-primary"
            />
          </div>
        );

      case 'parceiros':
      case 'indicados':
        return (
          <div className="max-w-md mx-auto">
            <FunnelColumn 
              title={funnel.name} 
              stages={stages} 
              color="bg-primary"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const calculateTotalStages = (stages: typeof data.stages) => {
    const stageNames: StageName[] = [
      'em_contato', 'reunioes', 'follow_up', 'propostas',
      'negociacoes', 'contratos', 'contratos_assinados',
      'oportunidades_perdidas', 'oportunidades_vencidas'
    ];

    return stageNames.map(stageName => {
      const stagesForName = stages.filter(s => s.stage_name === stageName);
      const totalLeads = stagesForName.reduce((sum, s) => sum + s.lead_count, 0);
      const totalValue = stagesForName.reduce((sum, s) => sum + Number(s.total_value), 0);

      return {
        id: `total_${stageName}`,
        funnel_id: funnel.id,
        stage_name: stageName,
        lead_count: totalLeads,
        total_value: totalValue,
        source: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title={`Funil de Vendas - ${funnel.name}`}
          showBackButton
          onGenerateReport={handleGenerateReport}
        />

        <PerformanceMetrics {...metrics} />

        {renderFunnelColumns()}

        <FinancialSummaryTable 
          stages={calculateTotalStages(stages)} 
          title={`Resumo Financeiro - ${funnel.name}`}
        />
      </div>
    </div>
  );
}
