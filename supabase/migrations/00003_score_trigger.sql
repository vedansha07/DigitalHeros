CREATE OR REPLACE FUNCTION enforce_max_scores()
RETURNS TRIGGER AS $$
DECLARE
    score_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO score_count FROM golf_scores WHERE user_id = NEW.user_id;

    IF score_count >= 5 THEN
        -- Delete the oldest score(s) to make room for the new one (leaving exactly 4 before the NEW insertion)
        DELETE FROM golf_scores
        WHERE id IN (
            SELECT id FROM golf_scores
            WHERE user_id = NEW.user_id
            ORDER BY score_date ASC, created_at ASC
            LIMIT (score_count - 4)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_scores_trigger
BEFORE INSERT ON golf_scores
FOR EACH ROW
EXECUTE FUNCTION enforce_max_scores();
