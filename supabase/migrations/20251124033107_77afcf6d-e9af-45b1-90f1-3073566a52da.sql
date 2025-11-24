-- Create user_invitations table
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email, entity_id)
);

-- Enable RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view entity invitations"
  ON public.user_invitations
  FOR SELECT
  USING (
    entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  );

CREATE POLICY "Users can create invitations with permission"
  ON public.user_invitations
  FOR INSERT
  WITH CHECK (
    has_permission(auth.uid(), 'users.invite') AND
    entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  );

CREATE POLICY "Users can delete invitations with permission"
  ON public.user_invitations
  FOR DELETE
  USING (
    has_permission(auth.uid(), 'users.invite') AND
    entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  );

CREATE POLICY "Anyone can validate unused invitation tokens"
  ON public.user_invitations
  FOR SELECT
  USING (
    NOT used AND expires_at > NOW()
  );

-- Function to generate invitation token
CREATE OR REPLACE FUNCTION public.generate_invitation_token(
  _email TEXT,
  _entity_id UUID,
  _role_id UUID,
  _invited_by UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token TEXT;
BEGIN
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '/', '_'), '+', '-'), '=', '');
  
  INSERT INTO user_invitations (email, entity_id, role_id, token, invited_by)
  VALUES (_email, _entity_id, _role_id, v_token, _invited_by);
  
  RETURN v_token;
END;
$$;

-- Update handle_new_user trigger to use invitations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  -- Check for valid invitation
  SELECT * INTO v_invitation
  FROM user_invitations
  WHERE email = NEW.email
    AND NOT used
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_invitation IS NULL THEN
    RAISE EXCEPTION 'No valid invitation found for this email';
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, name, email, entity_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    v_invitation.entity_id
  );

  -- Assign role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, v_invitation.role_id);

  -- Mark invitation as used
  UPDATE user_invitations
  SET used = true, used_at = NOW()
  WHERE id = v_invitation.id;

  RETURN NEW;
END;
$$;

-- Add users.invite permission
INSERT INTO public.permissions (id, name, category, description)
VALUES ('users.invite', 'Invite Users', 'users', 'Can invite new users to the platform')
ON CONFLICT (id) DO NOTHING;