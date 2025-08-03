CREATE TABLE likes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE likes ADD CONSTRAINT unique_like UNIQUE (post_id, user_id);

CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);