-- Create funnels table to track different funnel types
CREATE TABLE public.funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('eventos', 'ads', 'outbound', 'parceiros', 'indicados')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create funnel_stages table to track leads at each stage
CREATE TABLE public.funnel_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL CHECK (stage_name IN (
    'em_contato', 'reunioes', 'follow_up', 'propostas', 
    'negociacoes', 'contratos', 'contratos_assinados', 
    'oportunidades_perdidas', 'oportunidades_vencidas'
  )),
  lead_count INTEGER NOT NULL DEFAULT 0,
  total_value DECIMAL(15,2) DEFAULT 0,
  source TEXT, -- For multi-column funnels (e.g., 'evento_a', 'meta', 'cold_email')
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reports table to track report history
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  conversion_rate DECIMAL(5,2),
  closed_revenue DECIMAL(15,2),
  total_pipeline DECIMAL(15,2),
  average_ticket DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
CREATE POLICY "Allow public read access on funnels"
  ON public.funnels FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on funnels"
  ON public.funnels FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on funnels"
  ON public.funnels FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read access on funnel_stages"
  ON public.funnel_stages FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on funnel_stages"
  ON public.funnel_stages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update on funnel_stages"
  ON public.funnel_stages FOR UPDATE
  USING (true);

CREATE POLICY "Allow public read access on reports"
  ON public.reports FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert on reports"
  ON public.reports FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at on funnels
CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on funnel_stages
CREATE TRIGGER update_funnel_stages_updated_at
  BEFORE UPDATE ON public.funnel_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for Eventos funnel
INSERT INTO public.funnels (name, type) VALUES ('Eventos', 'eventos');

-- Get the funnel_id for eventos (we'll use a variable approach)
DO $$
DECLARE
  eventos_id UUID;
  ads_id UUID;
  outbound_id UUID;
  parceiros_id UUID;
  indicados_id UUID;
BEGIN
  -- Insert and get IDs
  INSERT INTO public.funnels (name, type) VALUES ('ADS', 'ads') RETURNING id INTO ads_id;
  INSERT INTO public.funnels (name, type) VALUES ('Outbound', 'outbound') RETURNING id INTO outbound_id;
  INSERT INTO public.funnels (name, type) VALUES ('Parceiros', 'parceiros') RETURNING id INTO parceiros_id;
  INSERT INTO public.funnels (name, type) VALUES ('Indicados', 'indicados') RETURNING id INTO indicados_id;
  
  SELECT id INTO eventos_id FROM public.funnels WHERE type = 'eventos' LIMIT 1;

  -- Sample data for Eventos (Evento A)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (eventos_id, 'em_contato', 150, 0, 'expo_25'),
    (eventos_id, 'reunioes', 120, 0, 'expo_25'),
    (eventos_id, 'follow_up', 100, 0, 'expo_25'),
    (eventos_id, 'propostas', 85, 0, 'expo_25'),
    (eventos_id, 'negociacoes', 70, 1750000, 'expo_25'),
    (eventos_id, 'contratos', 55, 1375000, 'expo_25'),
    (eventos_id, 'contratos_assinados', 45, 1125000, 'expo_25'),
    (eventos_id, 'oportunidades_perdidas', 25, 0, 'expo_25'),
    (eventos_id, 'oportunidades_vencidas', 10, 0, 'expo_25');

  -- Sample data for Eventos (Evento B)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (eventos_id, 'em_contato', 130, 0, 'lec_25'),
    (eventos_id, 'reunioes', 110, 0, 'lec_25'),
    (eventos_id, 'follow_up', 90, 0, 'lec_25'),
    (eventos_id, 'propostas', 75, 0, 'lec_25'),
    (eventos_id, 'negociacoes', 60, 1500000, 'lec_25'),
    (eventos_id, 'contratos', 48, 1200000, 'lec_25'), 
    (eventos_id, 'contratos_assinados', 40, 1000000, 'lec_25'),
    (eventos_id, 'oportunidades_perdidas', 20, 0, 'lec_25'),
    (eventos_id, 'oportunidades_vencidas', 8, 0, 'lec_25');

  -- Sample data for ADS (Meta)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (ads_id, 'em_contato', 200, 0, 'meta'),
    (ads_id, 'reunioes', 160, 0, 'meta'),
    (ads_id, 'follow_up', 130, 0, 'meta'),
    (ads_id, 'propostas', 110, 0, 'meta'),
    (ads_id, 'negociacoes', 80, 2000000, 'meta'),
    (ads_id, 'contratos', 60, 1500000, 'meta'),
    (ads_id, 'contratos_assinados', 48, 1200000, 'meta'),
    (ads_id, 'oportunidades_perdidas', 30, 0, 'meta'),
    (ads_id, 'oportunidades_vencidas', 12, 0, 'meta');

  -- Sample data for ADS (Google)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (ads_id, 'em_contato', 180, 0, 'google'),
    (ads_id, 'reunioes', 145, 0, 'google'),
    (ads_id, 'follow_up', 120, 0, 'google'),
    (ads_id, 'propostas', 100, 0, 'google'),
    (ads_id, 'negociacoes', 75, 1875000, 'google'),
    (ads_id, 'contratos', 58, 1450000, 'google'),
    (ads_id, 'contratos_assinados', 46, 1150000, 'google'),
    (ads_id, 'oportunidades_perdidas', 28, 0, 'google'),
    (ads_id, 'oportunidades_vencidas', 10, 0, 'google');

  -- Sample data for Outbound (Cold Email)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (outbound_id, 'em_contato', 250, 0, 'cold_email'),
    (outbound_id, 'reunioes', 180, 0, 'cold_email'),
    (outbound_id, 'follow_up', 145, 0, 'cold_email'),
    (outbound_id, 'propostas', 120, 0, 'cold_email'),
    (outbound_id, 'negociacoes', 90, 2250000, 'cold_email'),
    (outbound_id, 'contratos', 70, 1750000, 'cold_email'),
    (outbound_id, 'contratos_assinados', 55, 1375000, 'cold_email'),
    (outbound_id, 'oportunidades_perdidas', 35, 0, 'cold_email'),
    (outbound_id, 'oportunidades_vencidas', 15, 0, 'cold_email');

  -- Sample data for Outbound (Cold Call)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (outbound_id, 'em_contato', 220, 0, 'cold_call'),
    (outbound_id, 'reunioes', 165, 0, 'cold_call'),
    (outbound_id, 'follow_up', 135, 0, 'cold_call'),
    (outbound_id, 'propostas', 110, 0, 'cold_call'),
    (outbound_id, 'negociacoes', 85, 2125000, 'cold_call'),
    (outbound_id, 'contratos', 65, 1625000, 'cold_call'),
    (outbound_id, 'contratos_assinados', 52, 1300000, 'cold_call'),
    (outbound_id, 'oportunidades_perdidas', 32, 0, 'cold_call'),
    (outbound_id, 'oportunidades_vencidas', 13, 0, 'cold_call');

  -- Sample data for Outbound (LinkedIn)
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (outbound_id, 'em_contato', 190, 0, 'linkedin'),
    (outbound_id, 'reunioes', 150, 0, 'linkedin'),
    (outbound_id, 'follow_up', 125, 0, 'linkedin'),
    (outbound_id, 'propostas', 105, 0, 'linkedin'),
    (outbound_id, 'negociacoes', 80, 2000000, 'linkedin'),
    (outbound_id, 'contratos', 62, 1550000, 'linkedin'),
    (outbound_id, 'contratos_assinados', 50, 1250000, 'linkedin'),
    (outbound_id, 'oportunidades_perdidas', 30, 0, 'linkedin'),
    (outbound_id, 'oportunidades_vencidas', 12, 0, 'linkedin');

  -- Sample data for Parceiros
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (parceiros_id, 'em_contato', 100, 0, null),
    (parceiros_id, 'reunioes', 80, 0, null),
    (parceiros_id, 'follow_up', 65, 0, null),
    (parceiros_id, 'propostas', 55, 0, null),
    (parceiros_id, 'negociacoes', 45, 1125000, null),
    (parceiros_id, 'contratos', 35, 875000, null),
    (parceiros_id, 'contratos_assinados', 28, 700000, null),
    (parceiros_id, 'oportunidades_perdidas', 15, 0, null),
    (parceiros_id, 'oportunidades_vencidas', 7, 0, null);

  -- Sample data for Indicados
  INSERT INTO public.funnel_stages (funnel_id, stage_name, lead_count, total_value, source) VALUES
    (indicados_id, 'em_contato', 120, 0, null),
    (indicados_id, 'reunioes', 95, 0, null),
    (indicados_id, 'follow_up', 78, 0, null),
    (indicados_id, 'propostas', 65, 0, null),
    (indicados_id, 'negociacoes', 52, 1300000, null),
    (indicados_id, 'contratos', 40, 1000000, null),
    (indicados_id, 'contratos_assinados', 32, 800000, null),
    (indicados_id, 'oportunidades_perdidas', 18, 0, null),
    (indicados_id, 'oportunidades_vencidas', 8, 0, null);

END $$;