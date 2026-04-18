-- TABLE 3 — charities
CREATE TABLE charities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    logo_url text,
    images text[],
    is_featured boolean DEFAULT false,
    upcoming_events jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- TABLE 1 — users (extends Supabase auth.users)
CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    subscription_status subscription_status_enum DEFAULT 'inactive',
    subscription_plan subscription_plan_enum,
    subscription_renewal_date timestamptz,
    stripe_customer_id text UNIQUE,
    selected_charity_id uuid REFERENCES charities(id) ON DELETE SET NULL,
    charity_contribution_percentage integer DEFAULT 10 CHECK (charity_contribution_percentage >= 10 AND charity_contribution_percentage <= 100),
    created_at timestamptz DEFAULT now()
);

-- TABLE 2 — golf_scores
CREATE TABLE golf_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score integer NOT NULL CHECK (score >= 1 AND score <= 45),
    score_date date NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (user_id, score_date)
);

-- TABLE 4 — subscriptions
CREATE TABLE subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id text UNIQUE,
    plan subscription_plan_enum,
    status subscription_status_enum,
    monthly_fee numeric(10,2),
    start_date timestamptz,
    end_date timestamptz,
    created_at timestamptz DEFAULT now()
);

-- TABLE 5 — draws
CREATE TABLE draws (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_month date UNIQUE NOT NULL,
    draw_type draw_type_enum NOT NULL,
    algorithmic_weight algorithmic_weight_enum,
    drawn_numbers integer[] NOT NULL,
    status draw_status_enum DEFAULT 'draft',
    jackpot_rollover_amount numeric(10,2) DEFAULT 0,
    total_prize_pool numeric(10,2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- TABLE 6 — draw_entries
CREATE TABLE draw_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id uuid NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score_snapshot integer[] NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE (draw_id, user_id)
);

-- TABLE 7 — draw_results
CREATE TABLE draw_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id uuid NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_type match_type_enum NOT NULL,
    prize_amount numeric(10,2) NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
);

-- TABLE 8 — winner_verifications
CREATE TABLE winner_verifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_result_id uuid NOT NULL REFERENCES draw_results(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    proof_screenshot_url text NOT NULL,
    admin_status admin_status_enum DEFAULT 'pending',
    admin_notes text,
    reviewed_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- TABLE 9 — charity_contributions
CREATE TABLE charity_contributions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    charity_id uuid NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL,
    contribution_type contribution_type_enum NOT NULL,
    created_at timestamptz DEFAULT now()
);
