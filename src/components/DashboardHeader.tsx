import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  showBackButton?: boolean;
  onGenerateReport?: () => void;
}

export function DashboardHeader({ title, showBackButton = false, onGenerateReport }: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-card rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
        
        {onGenerateReport && (
          <Button 
            onClick={onGenerateReport}
            className="gap-2 rounded-full bg-primary hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Gerar Novo Relatório
          </Button>
        )}
      </div>
    </header>
  );
}
