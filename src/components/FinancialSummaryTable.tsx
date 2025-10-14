import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunnelStage, STAGE_LABELS, FINANCIAL_STAGES } from '@/types/funnel';

interface FinancialSummaryTableProps {
  stages: FunnelStage[];
  title?: string;
}

export function FinancialSummaryTable({ stages, title = 'Resumo Financeiro' }: FinancialSummaryTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const financialStages = stages.filter(stage => 
    FINANCIAL_STAGES.includes(stage.stage_name)
  );

  const totalOpportunities = financialStages.reduce((sum, stage) => sum + stage.lead_count, 0);
  const totalValue = financialStages.reduce((sum, stage) => sum + Number(stage.total_value), 0);

  const averageValue = totalOpportunities > 0 ? totalValue / totalOpportunities : 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-primary text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="font-semibold">Estágio</TableHead>
              <TableHead className="font-semibold text-center">Quantidade</TableHead>
              <TableHead className="font-semibold text-center">Valor Médio</TableHead>
              <TableHead className="font-semibold text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialStages.map((stage) => {
              const avgValue = stage.lead_count > 0 ? Number(stage.total_value) / stage.lead_count : 0;
              return (
                <TableRow key={stage.id}>
                  <TableCell className="font-medium">{STAGE_LABELS[stage.stage_name]}</TableCell>
                  <TableCell className="text-center text-primary font-semibold">
                    {formatNumber(stage.lead_count)}
                  </TableCell>
                  <TableCell className="text-center">{formatCurrency(avgValue)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(Number(stage.total_value))}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-primary text-white font-bold">
              <TableCell>Total Pipeline</TableCell>
              <TableCell className="text-center">{formatNumber(totalOpportunities)}</TableCell>
              <TableCell className="text-center">{formatCurrency(averageValue)}</TableCell>
              <TableCell className="text-right">{formatCurrency(totalValue)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
