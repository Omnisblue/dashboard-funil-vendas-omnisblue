import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelStage, STAGE_LABELS, FINANCIAL_STAGES, StageName } from '@/types/funnel';

interface FinancialSummaryTableProps {
  stages: FunnelStage[];
  title?: string;
  color?: string; // classe tailwind de background, ex.: bg-[#03045E]
}

export function FinancialSummaryTable({ stages, title = 'Resumo Financeiro', color }: FinancialSummaryTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const financialStages = stages.filter(stage => 
    FINANCIAL_STAGES.includes(stage.stage_name)
  );

  const orderedStageNames: StageName[] = [
    'negociacoes',
    'contratos',
    'contratos_assinados',
    'oportunidades_vencidas',
    'oportunidades_perdidas',
  ];

  const orderedStages = orderedStageNames
    .map(name => financialStages.find(s => s.stage_name === name))
    .filter(Boolean) as FunnelStage[];

  const totalOpportunities = financialStages.reduce((sum, stage) => sum + stage.lead_count, 0);
  const totalValue = financialStages.reduce((sum, stage) => sum + Number(stage.total_value), 0);

  const textColor = color ? color.replace('bg-', 'text-') : 'text-primary';
  const bgColor = color ? color : 'bg-primary';


  return (
    <Card className="mt-6 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className={`text-center ${textColor}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className={`${bgColor} text-white`}>
                <TableHead className="font-semibold text-white first:rounded-tl-xl">Estágio</TableHead>
                <TableHead className="font-semibold text-center text-white">Quantidade</TableHead>
                <TableHead className="font-semibold text-right text-white last:rounded-tr-xl">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedStages.map((stage) => {
                return (
                  <TableRow key={stage.id}>
                    <TableCell className="font-medium">{STAGE_LABELS[stage.stage_name]}</TableCell>
                    <TableCell className={`text-center font-semibold ${textColor}`}>
                      {formatNumber(stage.lead_count)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(Number(stage.total_value))}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className={`${bgColor} text-white font-bold`}>
                <TableCell className="first:rounded-bl-xl">Total Pipeline</TableCell>
                <TableCell className="text-center">{formatNumber(totalOpportunities)}</TableCell>
                <TableCell className="text-right last:rounded-br-xl">{formatCurrency(totalValue)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
