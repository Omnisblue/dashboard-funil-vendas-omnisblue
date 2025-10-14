import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useFunnelReports, useAllFunnels } from '@/hooks/useFunnelData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

export default function ReportsHistory() {
  const [selectedFunnel, setSelectedFunnel] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const { data: funnels } = useAllFunnels();
  const { data: reports, isLoading } = useFunnelReports(
    selectedFunnel === 'all' ? undefined : selectedFunnel
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredReports = reports?.filter(report => {
    if (!dateFilter) return true;
    return report.report_date === dateFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <p className="text-lg">Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader title="Histórico de Relatórios" showBackButton />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Funil</label>
                <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um funil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Funis</SelectItem>
                    {funnels?.map((funnel) => (
                      <SelectItem key={funnel.id} value={funnel.id}>
                        {funnel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Gerados</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReports && filteredReports.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary">
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold">Funil</TableHead>
                      <TableHead className="font-semibold text-center">
                        Taxa de Conversão
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Receita Fechada
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Pipeline Total
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Ticket Médio
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          {format(new Date(report.report_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {report.funnels?.name}
                        </TableCell>
                        <TableCell className="text-center text-primary font-semibold">
                          {Number(report.conversion_rate).toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(Number(report.closed_revenue))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(report.total_pipeline))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(report.average_ticket))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum relatório encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
