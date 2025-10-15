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
            variant="default"
            className="gap-2 rounded-full bg-[#0047CC] hover:bg-[#0037A6] text-white border-none"
          >
            <History className="h-5 w-5" />
            Ver Histórico
          </Button>
        </div>

        <div className="space-y-6">
          <FunnelCard
            title="Eventos"
            type="eventos"
            className="border-2"
            titleClassName="text-[#0047CC]"
            accentBgClass="bg-gradient-to-r from-[#0047CC] to-[#03045E]"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FunnelCard
              title="ADS"
              type="ads"
              className="border-2"
              titleClassName="text-[#00B5D8]"
              accentBgClass="bg-gradient-to-r from-[#00B5D8] to-[#0891B2]"
            />
            <FunnelCard
              title="Outbound"
              type="outbound"
              className="border-2"
              titleClassName="text-[#6A00B6]"
              accentBgClass="bg-gradient-to-r from-[#6A00B6] to-[#43007E]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FunnelCard
              title="Parceiros"
              type="parceiros"
              className="border-2"
              titleClassName="text-[#D0006F]"
              accentBgClass="bg-gradient-to-r from-[#D0006F] to-[#99004F]"
            />
            <FunnelCard
              title="Indicados"
              type="indicados"
              className="border-2"
              titleClassName="text-[#7C3AED]"
              accentBgClass="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
