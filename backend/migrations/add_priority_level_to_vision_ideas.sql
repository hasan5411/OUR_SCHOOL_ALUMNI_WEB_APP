-- Add missing priority_level column to vision_ideas if it was created before the field existed
ALTER TABLE vision_ideas
  ADD COLUMN IF NOT EXISTS priority_level VARCHAR(20) DEFAULT 'medium';

CREATE INDEX IF NOT EXISTS idx_vision_ideas_priority_level ON vision_ideas(priority_level);
