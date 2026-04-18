CREATE TYPE subscription_status_enum AS ENUM ('active', 'inactive', 'lapsed', 'cancelled');
CREATE TYPE subscription_plan_enum AS ENUM ('monthly', 'yearly');

CREATE TYPE draw_type_enum AS ENUM ('random', 'algorithmic');
CREATE TYPE algorithmic_weight_enum AS ENUM ('most_frequent', 'least_frequent');
CREATE TYPE draw_status_enum AS ENUM ('draft', 'simulated', 'published');

CREATE TYPE match_type_enum AS ENUM ('5_match', '4_match', '3_match');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid');

CREATE TYPE admin_status_enum AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE contribution_type_enum AS ENUM ('subscription_based', 'independent');
