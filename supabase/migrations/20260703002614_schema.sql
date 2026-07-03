-- SCAMBO - Complete Supabase Schema

-- 1. TABLES

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  pix_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE monthly_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month TEXT NOT NULL UNIQUE,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  winner_user_id UUID REFERENCES users(id),
  prize_amount DECIMAL(10,2),
  prize_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  image_url TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected', 'refunded')),
  payment_id TEXT,
  ranking_month TEXT NOT NULL REFERENCES monthly_rankings(month),
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE hall_of_fame (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_user_id UUID NOT NULL REFERENCES users(id),
  username TEXT NOT NULL,
  winner_image_url TEXT NOT NULL,
  month TEXT NOT NULL,
  posted_amount DECIMAL(10,2) NOT NULL,
  prize_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token TEXT,
  public_key TEXT,
  pix_key TEXT,
  sandbox BOOLEAN DEFAULT true,
  integration_status TEXT DEFAULT 'disconnected' CHECK (integration_status IN ('connected', 'disconnected', 'error')),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. INDEXES

CREATE INDEX idx_posts_ranking_month ON posts(ranking_month);
CREATE INDEX idx_posts_payment_status ON posts(payment_status);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_monthly_rankings_status ON monthly_rankings(status);
CREATE INDEX idx_hall_of_fame_month ON hall_of_fame(month);

-- 3. ROW LEVEL SECURITY

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_config ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can insert themselves" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Public ranking data: only username and created_at
CREATE POLICY "Public can read ranking data" ON users
  FOR SELECT USING (false);

-- Posts policies
CREATE POLICY "Public can read approved posts" ON posts
  FOR SELECT USING (payment_status = 'approved' AND deleted_at IS NULL);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Monthly rankings policies
CREATE POLICY "Public can read active rankings" ON monthly_rankings
  FOR SELECT USING (status = 'active' OR status = 'archived');

-- Hall of Fame policies (fully public)
CREATE POLICY "Public can read hall of fame" ON hall_of_fame
  FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admin full access users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin full access posts" ON posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin full access rankings" ON monthly_rankings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin full access hall_of_fame" ON hall_of_fame
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin full access payment_config" ON payment_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admin can read admin_users" ON admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- 4. STORAGE BUCKET

INSERT INTO storage.buckets (id, name, public) 
VALUES ('post_images', 'post_images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post_images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'post_images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'post_images' 
    AND auth.uid() = owner
  );

-- 5. FUNCTIONS

CREATE OR REPLACE FUNCTION get_public_ranking(p_month TEXT)
RETURNS TABLE (
  pos BIGINT,
  post_id UUID,
  image_url TEXT,
  username TEXT,
  amount DECIMAL,
  created_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY p.amount DESC, p.created_at ASC)::BIGINT AS pos,
    p.id,
    p.image_url,
    u.username,
    p.amount,
    p.created_at
  FROM posts p
  JOIN users u ON u.id = p.user_id
  WHERE p.ranking_month = p_month
    AND p.payment_status = 'approved'
    AND p.deleted_at IS NULL
  ORDER BY p.amount DESC, p.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_prize(p_month TEXT)
RETURNS TABLE (
  winner_post_id UUID,
  winner_user_id UUID,
  winner_amount DECIMAL,
  total_others DECIMAL,
  estimated_prize DECIMAL
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_winner_amount DECIMAL;
  v_total_others DECIMAL;
  v_winner_post_id UUID;
  v_winner_user_id UUID;
BEGIN
  SELECT p.id, p.user_id, p.amount 
  INTO v_winner_post_id, v_winner_user_id, v_winner_amount
  FROM posts p
  WHERE p.ranking_month = p_month
    AND p.payment_status = 'approved'
    AND p.deleted_at IS NULL
  ORDER BY p.amount DESC, p.created_at ASC
  LIMIT 1;

  SELECT COALESCE(SUM(p.amount), 0) - v_winner_amount
  INTO v_total_others
  FROM posts p
  WHERE p.ranking_month = p_month
    AND p.payment_status = 'approved'
    AND p.deleted_at IS NULL;

  RETURN QUERY SELECT 
    v_winner_post_id,
    v_winner_user_id,
    v_winner_amount,
    v_total_others,
    v_winner_amount + (v_total_others * 0.5);
END;
$$;

CREATE OR REPLACE FUNCTION close_monthly_ranking()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_active_month TEXT;
  v_winner_id UUID;
  v_winner_amount DECIMAL;
  v_prize DECIMAL;
  v_winner_post RECORD;
  v_winner_username TEXT;
  v_winner_image TEXT;
BEGIN
  -- Get active month
  SELECT month INTO v_active_month 
  FROM monthly_rankings 
  WHERE status = 'active' 
  LIMIT 1;
  
  IF v_active_month IS NULL THEN
    RAISE EXCEPTION 'No active ranking found';
  END IF;

  -- Find winner
  SELECT * INTO v_winner_post FROM calculate_prize(v_active_month);
  
  IF v_winner_post.winner_user_id IS NOT NULL THEN
    v_winner_id := v_winner_post.winner_user_id;
    v_winner_amount := v_winner_post.winner_amount;
    v_prize := v_winner_post.estimated_prize;

    -- Get winner info
    SELECT username INTO v_winner_username FROM users WHERE id = v_winner_id;
    SELECT image_url INTO v_winner_image FROM posts WHERE id = v_winner_post.winner_post_id;

    -- Add to hall of fame
    INSERT INTO hall_of_fame (winner_user_id, username, winner_image_url, month, posted_amount, prize_amount)
    VALUES (v_winner_id, v_winner_username, v_winner_image, v_active_month, v_winner_amount, v_prize);

    -- Update ranking
    UPDATE monthly_rankings 
    SET status = 'archived', 
        winner_user_id = v_winner_id, 
        prize_amount = v_prize 
    WHERE month = v_active_month;

    -- Soft delete non-winner posts
    UPDATE posts 
    SET deleted_at = now() 
    WHERE ranking_month = v_active_month 
      AND id != v_winner_post.winner_post_id;
  ELSE
    -- No winner, just archive
    UPDATE monthly_rankings 
    SET status = 'archived' 
    WHERE month = v_active_month;
  END IF;

  -- Create next month
  INSERT INTO monthly_rankings (month, starts_at, ends_at, status)
  VALUES (
    to_char(date_trunc('month', now() + interval '1 month'), 'YYYY-MM'),
    date_trunc('month', now() + interval '1 month'),
    date_trunc('month', now() + interval '2 months') - interval '1 second',
    'active'
  );
END;
$$;

-- 6. TRIGGER to auto-create monthly ranking

CREATE OR REPLACE FUNCTION ensure_current_month_ranking()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM monthly_rankings 
    WHERE month = to_char(date_trunc('month', now()), 'YYYY-MM')
  ) THEN
    INSERT INTO monthly_rankings (month, starts_at, ends_at, status)
    VALUES (
      to_char(date_trunc('month', now()), 'YYYY-MM'),
      date_trunc('month', now()),
      date_trunc('month', now() + interval '1 month') - interval '1 second',
      'active'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. SEED INITIAL ADMIN

-- Password: admin123 (bcrypt hash)
-- IMPORTANT: Change this after first login!
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (username) DO NOTHING;

-- Seed current month ranking
INSERT INTO monthly_rankings (month, starts_at, ends_at, status)
VALUES (
  to_char(date_trunc('month', now()), 'YYYY-MM'),
  date_trunc('month', now()),
  date_trunc('month', now() + interval '1 month') - interval '1 second',
  'active'
)
ON CONFLICT (month) DO NOTHING;
