import { DashboardHeader } from '@/components/DashboardHeader';
import { FunnelCard } from '@/components/FunnelCard';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <DashboardHeader title="Dashboard de Funil de Vendas" />
          <Button
            onClick={() => navigate('/relatorios')}
            variant="outline"
            className="gap-2 rounded-full"
          >
            <History className="h-5 w-5" />
            Ver Histórico
          </Button>
        </div>

        <div className="space-y-6">
          <FunnelCard title="Eventos" type="eventos" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FunnelCard title="ADS" type="ads" />
            <FunnelCard title="Outbound" type="outbound" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FunnelCard title="Parceiros" type="parceiros" />
            <FunnelCard title="Indicados" type="indicados" />
          </div>
        </div>
      </div>
    </div>
  );
}
