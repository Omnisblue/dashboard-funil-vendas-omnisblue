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

  const handleUpdateData = async () => {
    // 1. Defina todas as URLs em um array
    const webhookUrls = [
      'https://webhook.omnisbluecompliance.com/webhook/atualizar_dados_evento_a'
    ];

    // Mostra um toast imediato para o usuário saber que a ação começou
    toast({
      title: 'Atualização iniciada',
      description: 'Disparando os webhooks para buscar os dados mais recentes.',
    });

    try {
      // 2. Mapeia cada URL para uma Promise de fetch
      const requests = webhookUrls.map(async (url) => {
        // A lógica de fallback (POST -> GET) é aplicada individualmente para cada URL
        let response = await fetch(url, { method: 'POST' });
        
        if (!response.ok) {
          // Se o POST falhar, tenta com GET
          response = await fetch(url);
        }

        // Se ambos falharem, lança um erro que fará o Promise.all falhar
        if (!response.ok) {
          throw new Error(`Falha no webhook ${url} com status ${response.status}`);
        }
        
        return response;
      });

      // 3. Executa todas as Promises em paralelo e espera a conclusão de todas
      await Promise.all(requests);

      // 4. Se todas as promises foram resolvidas com sucesso:
      toast({
        title: 'Atualização concluída com sucesso!',
        description: 'Todos os funis foram atualizados.',
      });

    } catch (error) {
      // 5. Se qualquer uma das requisições falhar, o catch será acionado
      console.error("Erro ao disparar webhooks:", error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível disparar um ou mais webhooks.',
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primeiro: LEC 2025 */}
              <div className="space-y-4">
                <FunnelColumn
                  title="LEC 2025"
                  stages={groupedBySource['lec_25'] || groupedBySource['evento_a'] || []}
                  color="bg-gradient-to-b from-[#D0006F] to-[#99004F]"
                  showTotalLeads
                />
                <FinancialSummaryTable
                  stages={groupedBySource['lec_25'] || groupedBySource['evento_a'] || []}
                  title="Receita Esperada - LEC 2025"
                  color="bg-[#99004F]"
                />
              </div>
              {/* Segundo: EXPO 2025 */}
              <div className="space-y-4">
                <FunnelColumn
                  title="EXPO 2025"
                  stages={groupedBySource['expo_25'] || groupedBySource['evento_b'] || []}
                  color="bg-gradient-to-b from-[#0047CC] to-[#03045E]"
                  showTotalLeads
                />
                <FinancialSummaryTable
                  stages={groupedBySource['expo_25'] || groupedBySource['evento_b'] || []}
                  title="Receita Esperada - EXPO 2025"
                  color="bg-[#03045E]"
                />
              </div>
              {/* Terceiro: Total dos Eventos */}
              <div className="space-y-4">
                <FunnelColumn
                  title="Total dos Eventos"
                  stages={calculateTotalStages(stages)}
                  color="bg-gradient-to-b from-[#6A00B6] to-[#43007E]"
                  showTotalLeads
                />
                <FinancialSummaryTable
                  stages={calculateTotalStages(stages)}
                  title="Receita Esperada - Total"
                  color="bg-[#43007E]"
                />
              </div>
            </div>
          </div>
        );

      case 'ads':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <FunnelColumn 
                  title="Meta" 
                  stages={groupedBySource['meta'] || []} 
                  color="bg-gradient-to-b from-[#00B5D8] to-[#0891B2]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={groupedBySource['meta'] || []} 
                  title="Receita Esperada - Meta" 
                  color="bg-cyan"
                />
              </div>
              <div className="space-y-4">
                <FunnelColumn 
                  title="Google" 
                  stages={groupedBySource['google'] || []} 
                  color="bg-gradient-to-b from-[#0047CC] to-[#03045E]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={groupedBySource['google'] || []} 
                  title="Receita Esperada - Google" 
                  color="bg-[#03045E]"
                />
              </div>
              <div className="space-y-4">
                <FunnelColumn 
                  title="Total" 
                  stages={calculateTotalStages(stages)} 
                  color="bg-gradient-to-b from-[#3B82F6] to-[#1E40AF]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={calculateTotalStages(stages)} 
                  title="Receita Esperada - ADS" 
                  color="bg-blue"
                />
              </div>
            </div>
          </div>
        );

      case 'outbound':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <FunnelColumn 
                  title="Cold E-mail" 
                  stages={groupedBySource['cold_email'] || []} 
                  color="bg-gradient-to-b from-[#6A00B6] to-[#43007E]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={groupedBySource['cold_email'] || []} 
                  title="Receita Esperada - Cold E-mail" 
                  color="bg-purple"
                />
              </div>
              <div className="space-y-4">
                <FunnelColumn 
                  title="Cold Call" 
                  stages={groupedBySource['cold_call'] || []} 
                  color="bg-gradient-to-b from-[#7C3AED] to-[#5B21B6]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={groupedBySource['cold_call'] || []} 
                  title="Receita Esperada - Cold Call" 
                  color="bg-violet"
                />
              </div>
              <div className="space-y-4">
                <FunnelColumn 
                  title="LinkedIn" 
                  stages={groupedBySource['linkedin'] || []} 
                  color="bg-gradient-to-b from-[#D0006F] to-[#99004F]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={groupedBySource['linkedin'] || []} 
                  title="Receita Esperada - LinkedIn" 
                  color="bg-magenta"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <FunnelColumn 
                  title="Total Outbound" 
                  stages={calculateTotalStages(stages)} 
                  color="bg-gradient-to-b from-[#6A00B6] to-[#43007E]"
                  showTotalLeads
                />
                <FinancialSummaryTable 
                  stages={calculateTotalStages(stages)} 
                  title="Receita Esperada - Outbound" 
                  color="bg-purple"
                />
              </div>
            </div>
          </div>
        );

      case 'parceiros':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <FunnelColumn 
                title={funnel.name} 
                stages={stages} 
                color="bg-gradient-to-b from-[#D0006F] to-[#99004F]"
                showTotalLeads
              />
              <FinancialSummaryTable 
                stages={calculateTotalStages(stages)} 
                title={`Receita Esperada - ${funnel.name}`} 
                color="bg-magenta"
              />
            </div>
          </div>
        );

      case 'indicados':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <FunnelColumn 
                title={funnel.name} 
                stages={stages} 
                color="bg-gradient-to-b from-[#7C3AED] to-[#5B21B6]"
                showTotalLeads
              />
              <FinancialSummaryTable 
                stages={calculateTotalStages(stages)} 
                title={`Receita Esperada - ${funnel.name}`} 
                color="bg-violet"
              />
            </div>
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
      <div className="w-full mx-auto">
        <DashboardHeader
          title={`Funil de Vendas - ${funnel.name}`}
          showBackButton
          onGenerateReport={handleGenerateReport}
          onUpdateData={handleUpdateData}
        />

        <PerformanceMetrics {...metrics} />

        {renderFunnelColumns()}

        {/* Tabelas já renderizadas abaixo de cada funil no grid acima */}
      </div>
    </div>
  );
}
