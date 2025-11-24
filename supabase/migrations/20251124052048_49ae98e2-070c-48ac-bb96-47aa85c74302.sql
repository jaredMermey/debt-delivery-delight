-- Fix existing distributors to have parent_entity_id pointing to root
UPDATE entities 
SET parent_entity_id = (SELECT id FROM entities WHERE type = 'root' LIMIT 1)
WHERE type = 'distributor' AND parent_entity_id IS NULL;