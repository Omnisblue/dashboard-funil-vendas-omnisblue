import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  showBackButton?: boolean;
  onGenerateReport?: () => void;
  onUpdateData?: () => void;
}

export function DashboardHeader({ title, showBackButton = false, onGenerateReport, onUpdateData }: DashboardHeaderProps) {
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
        
        {(onGenerateReport || onUpdateData) && (
          <div className="flex items-center gap-3">
            {onUpdateData && (
              <Button
                onClick={onUpdateData}
                variant="outline"
                className="gap-2 rounded-full"
              >
                <RefreshCw className="h-5 w-5" />
                Atualizar
              </Button>
            )}
            {onGenerateReport && (
              <Button 
                onClick={onGenerateReport}
                className="gap-2 rounded-full bg-primary hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Salvar Novo Relatório
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
