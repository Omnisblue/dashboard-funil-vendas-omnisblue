import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FunnelType, FunnelStage, Funnel } from '@/types/funnel';

export function useFunnelData(funnelType: FunnelType) {
  return useQuery({
    queryKey: ['funnel', funnelType],
    queryFn: async () => {
      // Get funnel
      const { data: funnel, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('type', funnelType)
        .single();

      if (funnelError) throw funnelError;

      // Get stages
      const { data: stages, error: stagesError } = await supabase
        .from('funnel_stages')
        .select('*')
        .eq('funnel_id', funnel.id)
        .order('created_at');

      if (stagesError) throw stagesError;

      return { funnel: funnel as Funnel, stages: stages as FunnelStage[] };
    },
  });
}

export function useAllFunnels() {
  return useQuery({
    queryKey: ['funnels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at');

      if (error) throw error;
      return data as Funnel[];
    },
  });
}

export function useFunnelReports(funnelId?: string) {
  return useQuery({
    queryKey: ['reports', funnelId],
    queryFn: async () => {
      let query = supabase.from('reports').select('*, funnels(name, type)').order('report_date', { ascending: false });

      if (funnelId) {
        query = query.eq('funnel_id', funnelId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: true,
  });
}
