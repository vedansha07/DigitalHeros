-- Indexes on user_id columns
CREATE INDEX IF NOT EXISTS idx_golf_scores_user_id ON golf_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_entries_user_id ON draw_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_results_user_id ON draw_results(user_id);
CREATE INDEX IF NOT EXISTS idx_winner_verifications_user_id ON winner_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_charity_contributions_user_id ON charity_contributions(user_id);

-- Other requested indexes
CREATE INDEX IF NOT EXISTS idx_draws_draw_month ON draws(draw_month);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
