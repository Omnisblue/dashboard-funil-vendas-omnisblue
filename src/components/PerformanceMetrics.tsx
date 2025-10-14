import { Card, CardContent } from '@/components/ui/card';

interface PerformanceMetricsProps {
  conversionRate: number;
  closedRevenue: number;
  totalPipeline: number;
  averageTicket: number;
}

export function PerformanceMetrics({
  conversionRate,
  closedRevenue,
  totalPipeline,
  averageTicket,
}: PerformanceMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const metrics = [
    {
      label: 'Taxa de Conversão',
      value: `${conversionRate.toFixed(1)}%`,
      color: 'text-blue',
    },
    {
      label: 'Receita Fechada',
      value: formatCurrency(closedRevenue),
      color: 'text-blue',
    },
    {
      label: 'Pipeline Total',
      value: formatCurrency(totalPipeline),
      color: 'text-blue',
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(averageTicket),
      color: 'text-blue',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-primary mb-4">Estatísticas de Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-secondary">
            <CardContent className="p-6">
              <p className={`text-3xl font-bold ${metric.color} mb-2`}>
                {metric.value}
              </p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
