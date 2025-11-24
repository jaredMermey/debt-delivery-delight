-- Delete the duplicate Walter White entry (newer one created at 05:10:29)
DELETE FROM consumer_tracking WHERE consumer_id = '61e51a14-6f37-409e-9281-4ee2aa0e84a0';
DELETE FROM consumer_tokens WHERE consumer_id = '61e51a14-6f37-409e-9281-4ee2aa0e84a0';
DELETE FROM consumers WHERE id = '61e51a14-6f37-409e-9281-4ee2aa0e84a0';

-- Add unique constraint to prevent future duplicates
ALTER TABLE consumers 
ADD CONSTRAINT consumers_email_campaign_id_unique 
UNIQUE (email, campaign_id);

-- Update campaign stats
SELECT update_campaign_stats('56616998-6692-4be9-955f-1a343c3eb8f0');