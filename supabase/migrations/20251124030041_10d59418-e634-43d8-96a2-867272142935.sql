-- =====================================================
-- PHASE 1: CREATE ENUMS
-- =====================================================

CREATE TYPE entity_type AS ENUM ('root', 'distributor', 'customer');
CREATE TYPE campaign_status AS ENUM ('draft', 'sent', 'active', 'completed', 'cancelled');
CREATE TYPE payment_method_type AS ENUM ('ach', 'check', 'prepaid', 'realtime', 'paypal', 'venmo', 'zelle', 'crypto', 'international');
CREATE TYPE tracking_status AS ENUM ('pending', 'email_sent', 'email_opened', 'link_clicked', 'payment_selected', 'funds_originated', 'funds_settled');
CREATE TYPE fee_type AS ENUM ('dollar', 'percentage');
CREATE TYPE app_role AS ENUM ('distributor_admin', 'customer_admin', 'customer_user');

-- =====================================================
-- PHASE 2: CREATE CORE TABLES
-- =====================================================

-- Entities table (hierarchy: root -> distributors -> customers)
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type entity_type NOT NULL,
  logo TEXT NOT NULL,
  brand_color TEXT,
  parent_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_entities_parent ON entities(parent_entity_id);
CREATE INDEX idx_entities_type ON entities(type);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_entity ON profiles(entity_id);

-- =====================================================
-- PHASE 3: CREATE RBAC TABLES
-- =====================================================

-- Permissions table
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL
);

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, entity_id)
);

CREATE INDEX idx_roles_entity ON roles(entity_id);

-- User roles junction table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- Role permissions junction table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);

-- =====================================================
-- PHASE 4: CREATE CAMPAIGN TABLES
-- =====================================================

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  bank_logo TEXT NOT NULL,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  status campaign_status DEFAULT 'draft',
  advertisement_image TEXT,
  advertisement_url TEXT,
  advertisement_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  total_emails_sent INTEGER DEFAULT 0,
  total_emails_opened INTEGER DEFAULT 0,
  total_links_clicked INTEGER DEFAULT 0,
  total_funds_selected INTEGER DEFAULT 0,
  total_funds_originated INTEGER DEFAULT 0,
  total_funds_settled INTEGER DEFAULT 0
);

CREATE INDEX idx_campaigns_entity ON campaigns(entity_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);

-- Campaign payment methods table
CREATE TABLE campaign_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  fee_type fee_type DEFAULT 'dollar',
  fee_amount DECIMAL(10, 2) DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, type)
);

CREATE INDEX idx_campaign_payment_methods_campaign ON campaign_payment_methods(campaign_id);

-- Campaign stats table (denormalized for performance)
CREATE TABLE campaign_stats (
  campaign_id UUID PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
  total_consumers INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  links_clicked INTEGER DEFAULT 0,
  funds_selected INTEGER DEFAULT 0,
  funds_originated INTEGER DEFAULT 0,
  funds_settled INTEGER DEFAULT 0,
  total_amount DECIMAL(12, 2) DEFAULT 0,
  originated_amount DECIMAL(12, 2) DEFAULT 0,
  settled_amount DECIMAL(12, 2) DEFAULT 0,
  email_open_rate DECIMAL(5, 2) DEFAULT 0,
  link_click_rate DECIMAL(5, 2) DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PHASE 5: CREATE CONSUMER TABLES
-- =====================================================

-- Consumers table
CREATE TABLE consumers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consumers_campaign ON consumers(campaign_id);
CREATE INDEX idx_consumers_email ON consumers(email);

-- Consumer tokens table (for unique access URLs)
CREATE TABLE consumer_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consumer_tokens_token ON consumer_tokens(token);
CREATE INDEX idx_consumer_tokens_consumer ON consumer_tokens(consumer_id);

-- Consumer tracking table
CREATE TABLE consumer_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID NOT NULL REFERENCES consumers(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  status tracking_status DEFAULT 'pending',
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,
  email_opened BOOLEAN DEFAULT FALSE,
  email_opened_at TIMESTAMPTZ,
  link_clicked BOOLEAN DEFAULT FALSE,
  link_clicked_at TIMESTAMPTZ,
  payment_method_selected payment_method_type,
  payment_method_selected_at TIMESTAMPTZ,
  funds_originated BOOLEAN DEFAULT FALSE,
  funds_originated_at TIMESTAMPTZ,
  funds_settled BOOLEAN DEFAULT FALSE,
  funds_settled_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(consumer_id, campaign_id)
);

CREATE INDEX idx_consumer_tracking_consumer ON consumer_tracking(consumer_id);
CREATE INDEX idx_consumer_tracking_campaign ON consumer_tracking(campaign_id);
CREATE INDEX idx_consumer_tracking_status ON consumer_tracking(status);

-- Audit log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- =====================================================
-- PHASE 6: CREATE SECURITY FUNCTIONS
-- =====================================================

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION has_permission(_user_id UUID, _permission TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.user_id = _user_id AND rp.permission_id = _permission
  );
$$;

-- Function to get user's accessible entities (entity tree)
CREATE OR REPLACE FUNCTION get_user_entity_and_descendants(_user_id UUID)
RETURNS TABLE (entity_id UUID)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE entity_tree AS (
    SELECT e.id, e.parent_entity_id
    FROM entities e
    JOIN profiles p ON p.entity_id = e.id
    WHERE p.id = _user_id
    UNION ALL
    SELECT e.id, e.parent_entity_id
    FROM entities e
    JOIN entity_tree et ON e.parent_entity_id = et.id
  )
  SELECT id FROM entity_tree;
$$;

-- Function to update campaign stats
CREATE OR REPLACE FUNCTION update_campaign_stats(_campaign_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats RECORD;
BEGIN
  SELECT
    COUNT(c.id) as total_consumers,
    COUNT(ct.id) FILTER (WHERE ct.email_sent) as emails_sent,
    COUNT(ct.id) FILTER (WHERE ct.email_opened) as emails_opened,
    COUNT(ct.id) FILTER (WHERE ct.link_clicked) as links_clicked,
    COUNT(ct.id) FILTER (WHERE ct.payment_method_selected IS NOT NULL) as funds_selected,
    COUNT(ct.id) FILTER (WHERE ct.funds_originated) as funds_originated,
    COUNT(ct.id) FILTER (WHERE ct.funds_settled) as funds_settled,
    COALESCE(SUM(c.amount), 0) as total_amount,
    COALESCE(SUM(c.amount) FILTER (WHERE ct.funds_originated), 0) as originated_amount,
    COALESCE(SUM(c.amount) FILTER (WHERE ct.funds_settled), 0) as settled_amount
  INTO v_stats
  FROM consumers c
  LEFT JOIN consumer_tracking ct ON ct.consumer_id = c.id
  WHERE c.campaign_id = _campaign_id;

  INSERT INTO campaign_stats (
    campaign_id, total_consumers, emails_sent, emails_opened, links_clicked,
    funds_selected, funds_originated, funds_settled, total_amount,
    originated_amount, settled_amount, email_open_rate, link_click_rate,
    completion_rate, updated_at
  )
  VALUES (
    _campaign_id, v_stats.total_consumers, v_stats.emails_sent,
    v_stats.emails_opened, v_stats.links_clicked, v_stats.funds_selected,
    v_stats.funds_originated, v_stats.funds_settled, v_stats.total_amount,
    v_stats.originated_amount, v_stats.settled_amount,
    CASE WHEN v_stats.emails_sent > 0 THEN (v_stats.emails_opened::DECIMAL / v_stats.emails_sent) * 100 ELSE 0 END,
    CASE WHEN v_stats.emails_opened > 0 THEN (v_stats.links_clicked::DECIMAL / v_stats.emails_opened) * 100 ELSE 0 END,
    CASE WHEN v_stats.total_consumers > 0 THEN (v_stats.funds_settled::DECIMAL / v_stats.total_consumers) * 100 ELSE 0 END,
    NOW()
  )
  ON CONFLICT (campaign_id) DO UPDATE SET
    total_consumers = EXCLUDED.total_consumers,
    emails_sent = EXCLUDED.emails_sent,
    emails_opened = EXCLUDED.emails_opened,
    links_clicked = EXCLUDED.links_clicked,
    funds_selected = EXCLUDED.funds_selected,
    funds_originated = EXCLUDED.funds_originated,
    funds_settled = EXCLUDED.funds_settled,
    total_amount = EXCLUDED.total_amount,
    originated_amount = EXCLUDED.originated_amount,
    settled_amount = EXCLUDED.settled_amount,
    email_open_rate = EXCLUDED.email_open_rate,
    link_click_rate = EXCLUDED.link_click_rate,
    completion_rate = EXCLUDED.completion_rate,
    updated_at = NOW();
END;
$$;

-- Function to generate mock tracking data (ports existing TypeScript logic)
CREATE OR REPLACE FUNCTION generate_mock_tracking_data(_campaign_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_consumer RECORD;
  v_progression DECIMAL;
  v_status tracking_status;
  v_email_sent_at TIMESTAMPTZ;
  v_email_opened_at TIMESTAMPTZ;
  v_link_clicked_at TIMESTAMPTZ;
  v_payment_selected_at TIMESTAMPTZ;
  v_funds_originated_at TIMESTAMPTZ;
  v_funds_settled_at TIMESTAMPTZ;
  v_payment_method payment_method_type;
  v_payment_methods payment_method_type[] := ARRAY['ach', 'prepaid', 'check', 'realtime', 'venmo', 'paypal'];
BEGIN
  FOR v_consumer IN 
    SELECT id FROM consumers WHERE campaign_id = _campaign_id
  LOOP
    v_progression := random();
    v_status := 'email_sent';
    
    v_email_sent_at := NOW() - (random() * INTERVAL '24 hours');
    
    IF v_progression > 0.3 THEN
      v_email_opened_at := v_email_sent_at + (random() * INTERVAL '2 hours');
      v_status := 'email_opened';
    ELSE
      v_email_opened_at := NULL;
    END IF;
    
    IF v_email_opened_at IS NOT NULL AND v_progression > 0.5 THEN
      v_link_clicked_at := v_email_opened_at + (random() * INTERVAL '30 minutes');
      v_status := 'link_clicked';
    ELSE
      v_link_clicked_at := NULL;
    END IF;
    
    IF v_link_clicked_at IS NOT NULL AND v_progression > 0.6 THEN
      v_payment_selected_at := v_link_clicked_at + (random() * INTERVAL '10 minutes');
      v_payment_method := v_payment_methods[1 + floor(random() * array_length(v_payment_methods, 1))::int];
      v_status := 'payment_selected';
    ELSE
      v_payment_selected_at := NULL;
      v_payment_method := NULL;
    END IF;
    
    IF v_payment_method IS NOT NULL AND v_progression > 0.7 THEN
      v_funds_originated_at := v_payment_selected_at + (random() * INTERVAL '1 hour');
      v_status := 'funds_originated';
    ELSE
      v_funds_originated_at := NULL;
    END IF;
    
    IF v_funds_originated_at IS NOT NULL AND v_progression > 0.8 THEN
      v_funds_settled_at := v_funds_originated_at + (random() * INTERVAL '24 hours');
      v_status := 'funds_settled';
    ELSE
      v_funds_settled_at := NULL;
    END IF;
    
    INSERT INTO consumer_tracking (
      consumer_id, campaign_id, status, email_sent, email_sent_at,
      email_opened, email_opened_at, link_clicked, link_clicked_at,
      payment_method_selected, payment_method_selected_at,
      funds_originated, funds_originated_at, funds_settled, funds_settled_at, last_activity
    ) VALUES (
      v_consumer.id, _campaign_id, v_status, TRUE, v_email_sent_at,
      v_email_opened_at IS NOT NULL, v_email_opened_at,
      v_link_clicked_at IS NOT NULL, v_link_clicked_at,
      v_payment_method, v_payment_selected_at,
      v_funds_originated_at IS NOT NULL, v_funds_originated_at,
      v_funds_settled_at IS NOT NULL, v_funds_settled_at,
      COALESCE(v_funds_settled_at, v_funds_originated_at, v_payment_selected_at, v_link_clicked_at, v_email_opened_at, v_email_sent_at)
    );
  END LOOP;
  
  PERFORM update_campaign_stats(_campaign_id);
END;
$$;

-- Function to generate consumer token
CREATE OR REPLACE FUNCTION generate_consumer_token(_consumer_id UUID, _campaign_id UUID)
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
  
  INSERT INTO consumer_tokens (consumer_id, campaign_id, token, expires_at)
  VALUES (_consumer_id, _campaign_id, v_token, NOW() + INTERVAL '90 days');
  
  RETURN v_token;
END;
$$;

-- =====================================================
-- PHASE 7: CREATE TRIGGERS
-- =====================================================

-- Trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, entity_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'entity_id')::uuid, (SELECT id FROM entities WHERE type = 'root' LIMIT 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger to update campaign stats when tracking changes
CREATE OR REPLACE FUNCTION trigger_update_campaign_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM update_campaign_stats(NEW.campaign_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_consumer_tracking_change
  AFTER INSERT OR UPDATE ON consumer_tracking
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_campaign_stats();

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- PHASE 8: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumers ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PHASE 9: CREATE RLS POLICIES
-- =====================================================

-- Entities policies
CREATE POLICY "Users can view accessible entities" ON entities
  FOR SELECT TO authenticated
  USING (id IN (SELECT get_user_entity_and_descendants(auth.uid())));

CREATE POLICY "Users can manage accessible entities" ON entities
  FOR ALL TO authenticated
  USING (id IN (SELECT get_user_entity_and_descendants(auth.uid())));

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view entity profiles" ON profiles
  FOR SELECT TO authenticated
  USING (entity_id IN (SELECT get_user_entity_and_descendants(auth.uid())));

-- Permissions policies
CREATE POLICY "Anyone can view permissions" ON permissions
  FOR SELECT TO authenticated
  USING (true);

-- Roles policies
CREATE POLICY "Users can view entity roles" ON roles
  FOR SELECT TO authenticated
  USING (entity_id IN (SELECT get_user_entity_and_descendants(auth.uid())));

-- User roles policies
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view entity user roles" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))));

-- Role permissions policies
CREATE POLICY "Users can view role permissions" ON role_permissions
  FOR SELECT TO authenticated
  USING (role_id IN (SELECT r.id FROM roles r WHERE r.entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))));

-- Campaigns policies
CREATE POLICY "Users can view entity campaigns" ON campaigns
  FOR SELECT TO authenticated
  USING (entity_id IN (SELECT get_user_entity_and_descendants(auth.uid())));

CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT TO authenticated
  WITH CHECK (
    has_permission(auth.uid(), 'campaigns.create') AND
    entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  );

CREATE POLICY "Users can update campaigns" ON campaigns
  FOR UPDATE TO authenticated
  USING (
    has_permission(auth.uid(), 'campaigns.edit') AND
    entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  );

CREATE POLICY "Users can delete campaigns" ON campaigns
  FOR DELETE TO authenticated
  USING (
    has_permission(auth.uid(), 'campaigns.delete') AND
    entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  );

-- Campaign payment methods policies
CREATE POLICY "Users can view campaign payment methods" ON campaign_payment_methods
  FOR SELECT TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

CREATE POLICY "Users can manage campaign payment methods" ON campaign_payment_methods
  FOR ALL TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

-- Campaign stats policies
CREATE POLICY "Users can view campaign stats" ON campaign_stats
  FOR SELECT TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

-- Consumers policies
CREATE POLICY "Users can view campaign consumers" ON consumers
  FOR SELECT TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

CREATE POLICY "Users can manage consumers" ON consumers
  FOR ALL TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

-- Consumer tokens policies (allow public read by token for consumer access)
CREATE POLICY "Anyone can validate tokens" ON consumer_tokens
  FOR SELECT TO anon, authenticated
  USING (NOT used AND (expires_at IS NULL OR expires_at > NOW()));

-- Consumer tracking policies
CREATE POLICY "Users can view consumer tracking" ON consumer_tracking
  FOR SELECT TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

CREATE POLICY "Users can update consumer tracking" ON consumer_tracking
  FOR ALL TO authenticated
  USING (campaign_id IN (
    SELECT id FROM campaigns WHERE entity_id IN (SELECT get_user_entity_and_descendants(auth.uid()))
  ));

-- Audit log policies
CREATE POLICY "Users can view entity audit logs" ON audit_log
  FOR SELECT TO authenticated
  USING (entity_id IN (SELECT get_user_entity_and_descendants(auth.uid())));

-- =====================================================
-- PHASE 10: SEED INITIAL DATA
-- =====================================================

-- Insert permissions
INSERT INTO permissions (id, name, description, category) VALUES
('campaigns.view', 'View Campaigns', 'View campaign list and details', 'campaigns'),
('campaigns.create', 'Create Campaigns', 'Create new campaigns', 'campaigns'),
('campaigns.edit', 'Edit Campaigns', 'Edit existing campaigns', 'campaigns'),
('campaigns.delete', 'Delete Campaigns', 'Delete campaigns', 'campaigns'),
('campaigns.send', 'Send Campaigns', 'Send campaigns to consumers', 'campaigns'),
('users.view', 'View Users', 'View user list within entity', 'users'),
('users.create', 'Create Users', 'Create new users', 'users'),
('users.edit', 'Edit Users', 'Edit user details and roles', 'users'),
('users.delete', 'Delete Users', 'Delete users', 'users'),
('reports.view', 'View Reports', 'View campaign reports', 'reports'),
('reports.export', 'Export Reports', 'Export report data', 'reports'),
('settings.view', 'View Settings', 'View entity settings', 'settings'),
('settings.edit', 'Edit Settings', 'Edit entity settings and branding', 'settings'),
('entities.view', 'View Entities', 'View child entities', 'settings'),
('entities.create', 'Create Entities', 'Create new child entities', 'settings'),
('entities.edit', 'Edit Entities', 'Edit child entity details', 'settings'),
('entities.delete', 'Delete Entities', 'Delete child entities', 'settings');

-- Insert entities
INSERT INTO entities (id, name, type, logo, brand_color, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Reliant', 'root', '/src/assets/reliant-logo.png', '#1e40af', '2024-01-01'),
('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Coterie Insurance', 'customer', '/src/assets/coterie-logo.png', '#7c3aed', '2024-02-01'),
('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Northwest Bank', 'distributor', '/src/assets/northwest-bank-logo.png', '#059669', '2024-01-15'),
('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Axos Bank', 'distributor', '/src/assets/axos-bank-logo.png', '#dc2626', '2024-01-20');

INSERT INTO entities (id, name, type, logo, brand_color, parent_entity_id, created_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d483', 'Smith Manufacturing', 'customer', '/lovable-uploads/b8219251-a9f5-4a4d-afdd-08c4573a268d.png', '#2563eb', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '2024-03-01'),
('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'Johnson Logistics', 'customer', '/lovable-uploads/35732e94-7d2c-42fe-9948-65816587b726.png', '#0891b2', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '2024-03-15'),
('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'Williams Retail', 'customer', '/lovable-uploads/15de4c78-6af4-4aa6-92c9-16fa882c3521.png', '#ea580c', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '2024-03-20');

-- Insert roles
INSERT INTO roles (id, name, entity_id) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d500', 'Reliant Administrator', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'Administrator', 'f47ac10b-58cc-4372-a567-0e02b2c3d480'),
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'Campaign Manager', 'f47ac10b-58cc-4372-a567-0e02b2c3d480'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'Bank Administrator', 'f47ac10b-58cc-4372-a567-0e02b2c3d481');

-- Grant all permissions to Reliant Administrator
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d500', id FROM permissions;

-- Grant permissions to Coterie Administrator
INSERT INTO role_permissions (role_id, permission_id) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'campaigns.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'campaigns.create'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'campaigns.edit'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'campaigns.delete'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'campaigns.send'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'users.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'users.create'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'users.edit'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'users.delete'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'reports.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'reports.export'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'settings.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d501', 'settings.edit');

-- Grant permissions to Coterie Campaign Manager
INSERT INTO role_permissions (role_id, permission_id) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'campaigns.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'campaigns.create'),
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'campaigns.edit'),
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'campaigns.send'),
('f47ac10b-58cc-4372-a567-0e02b2c3d502', 'reports.view');

-- Grant permissions to Bank Administrator
INSERT INTO role_permissions (role_id, permission_id) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'campaigns.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'campaigns.create'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'campaigns.edit'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'campaigns.delete'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'campaigns.send'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'users.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'users.create'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'users.edit'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'users.delete'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'reports.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'reports.export'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'settings.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'settings.edit'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'entities.view'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'entities.create'),
('f47ac10b-58cc-4372-a567-0e02b2c3d503', 'entities.edit');