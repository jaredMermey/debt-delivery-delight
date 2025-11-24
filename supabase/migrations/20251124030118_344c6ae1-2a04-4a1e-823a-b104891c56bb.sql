-- Fix security warnings: Add search_path to trigger functions

-- Update trigger_update_campaign_stats function
CREATE OR REPLACE FUNCTION trigger_update_campaign_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM update_campaign_stats(NEW.campaign_id);
  RETURN NEW;
END;
$$;

-- Update update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;