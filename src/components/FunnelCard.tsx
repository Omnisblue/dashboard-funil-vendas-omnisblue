import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FunnelType } from '@/types/funnel';

interface FunnelCardProps {
  title: string;
  type: FunnelType;
  className?: string;
}

export function FunnelCard({ title, type, className }: FunnelCardProps) {
  const navigate = useNavigate();

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${className}`}
      onClick={() => navigate(`/funil/${type}`)}
    >
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">{title}</h3>
          <ArrowRight className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-2 text-muted-foreground">Clique para ver detalhes do funil</p>
      </CardContent>
    </Card>
  );
}
