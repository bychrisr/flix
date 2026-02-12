ALTER TABLE events ADD COLUMN short_description TEXT NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN long_description TEXT NOT NULL DEFAULT '';

UPDATE events
SET
  short_description = CASE
    WHEN short_description = '' THEN description
    ELSE short_description
  END,
  long_description = CASE
    WHEN long_description = '' THEN description
    ELSE long_description
  END;
