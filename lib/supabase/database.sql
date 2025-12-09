-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('him', 'her')) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create romantic_memories table
CREATE TABLE romantic_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('photo', 'quote', 'memory', 'special-day', 'moment')) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create special_days table
CREATE TABLE special_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  category TEXT CHECK (category IN ('anniversary', 'first-time', 'milestone', 'celebration')) NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT,
  date DATE NOT NULL,
  context TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE romantic_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Romantic memories: both users can see all memories, but only the creator can update/delete
CREATE POLICY "Authenticated users can view all memories" ON romantic_memories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own memories" ON romantic_memories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own memories" ON romantic_memories
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own memories" ON romantic_memories
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Special days: both users can see all, but only the creator can update/delete
CREATE POLICY "Authenticated users can view all special days" ON special_days
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own special days" ON special_days
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own special days" ON special_days
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own special days" ON special_days
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Quotes: both users can see all, but only the creator can update/delete
CREATE POLICY "Authenticated users can view all quotes" ON quotes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own quotes" ON quotes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own quotes" ON quotes
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own quotes" ON quotes
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'him')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_romantic_memories_updated_at BEFORE UPDATE ON romantic_memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_special_days_updated_at BEFORE UPDATE ON special_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Para crear usuarios demo, usa el Dashboard de Supabase o la función signUpUser() desde la app