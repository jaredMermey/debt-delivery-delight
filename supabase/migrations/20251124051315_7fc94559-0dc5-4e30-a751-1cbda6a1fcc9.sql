DO $$
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
  -- Find all consumers without tracking data
  FOR v_consumer IN 
    SELECT c.id, c.campaign_id
    FROM consumers c
    LEFT JOIN consumer_tracking ct ON ct.consumer_id = c.id
    WHERE ct.id IS NULL
  LOOP
    -- Generate token for this consumer
    PERFORM generate_consumer_token(v_consumer.id, v_consumer.campaign_id);
    
    -- Generate mock tracking data
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
    
    -- Insert tracking record
    INSERT INTO consumer_tracking (
      consumer_id, campaign_id, status, email_sent, email_sent_at,
      email_opened, email_opened_at, link_clicked, link_clicked_at,
      payment_method_selected, payment_method_selected_at,
      funds_originated, funds_originated_at, funds_settled, funds_settled_at, last_activity
    ) VALUES (
      v_consumer.id, v_consumer.campaign_id, v_status, TRUE, v_email_sent_at,
      v_email_opened_at IS NOT NULL, v_email_opened_at,
      v_link_clicked_at IS NOT NULL, v_link_clicked_at,
      v_payment_method, v_payment_selected_at,
      v_funds_originated_at IS NOT NULL, v_funds_originated_at,
      v_funds_settled_at IS NOT NULL, v_funds_settled_at,
      COALESCE(v_funds_settled_at, v_funds_originated_at, v_payment_selected_at, v_link_clicked_at, v_email_opened_at, v_email_sent_at)
    );
    
    -- Update campaign stats for this campaign
    PERFORM update_campaign_stats(v_consumer.campaign_id);
  END LOOP;
END $$;