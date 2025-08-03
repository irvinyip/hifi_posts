-- Enable Row Level Security for the likes table
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own likes
CREATE POLICY "Users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view all likes (adjust if you want to restrict)
CREATE POLICY "Users can view all likes" ON likes
  FOR SELECT USING (true);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);