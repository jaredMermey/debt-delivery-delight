-- Fix search_path for generate_consumer_token to access pgcrypto extension
CREATE OR REPLACE FUNCTION public.generate_consumer_token(_consumer_id uuid, _campaign_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_token TEXT;
BEGIN
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '/', '_'), '+', '-'), '=', '');
  
  INSERT INTO consumer_tokens (consumer_id, campaign_id, token, expires_at)
  VALUES (_consumer_id, _campaign_id, v_token, NOW() + INTERVAL '90 days');
  
  RETURN v_token;
END;
$function$;

-- Fix search_path for generate_invitation_token to access pgcrypto extension
CREATE OR REPLACE FUNCTION public.generate_invitation_token(_email text, _entity_id uuid, _role_id uuid, _invited_by uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_token TEXT;
BEGIN
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '/', '_'), '+', '-'), '=', '');
  
  INSERT INTO user_invitations (email, entity_id, role_id, token, invited_by)
  VALUES (_email, _entity_id, _role_id, v_token, _invited_by);
  
  RETURN v_token;
END;
$function$;