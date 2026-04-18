-- Enable Row Level Security
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE winner_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_contributions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- Admin bypass policy for all tables
-- Based on the auth.jwt()->>'role' = 'admin' requirement
-- ----------------------------------------------------
CREATE POLICY "Admin bypass charities" ON charities FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass users" ON users FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass golf_scores" ON golf_scores FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass subscriptions" ON subscriptions FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass draws" ON draws FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass draw_entries" ON draw_entries FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass draw_results" ON draw_results FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass winner_verifications" ON winner_verifications FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin bypass charity_contributions" ON charity_contributions FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'admin');


-- ----------------------------------------------------
-- Standard RLS Policies: users manage own data
-- ----------------------------------------------------

-- Users (read/write their own info)
CREATE POLICY "Users view own profile" ON users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Charities (public read)
CREATE POLICY "Anyone can view charities" ON charities FOR SELECT USING (true);

-- Golf Scores (read/write own scores)
CREATE POLICY "Users read own scores" ON golf_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own scores" ON golf_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own scores" ON golf_scores FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own scores" ON golf_scores FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Subscriptions (read own)
CREATE POLICY "Users view own subscriptions" ON subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Draws (public read)
CREATE POLICY "Anyone can view draws" ON draws FOR SELECT USING (true);

-- Draw Entries (read own entries)
CREATE POLICY "Users view own entries" ON draw_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Draw Results (read own results)
CREATE POLICY "Users view own draw results" ON draw_results FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Winner Verifications (read/write own verifications)
CREATE POLICY "Users view own verifications" ON winner_verifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own verifications" ON winner_verifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own verifications" ON winner_verifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Charity Contributions (read own)
CREATE POLICY "Users view own contributions" ON charity_contributions FOR SELECT TO authenticated USING (auth.uid() = user_id);
