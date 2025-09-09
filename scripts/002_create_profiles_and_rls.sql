-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'guru', 'staff')),
  guru_id UUID REFERENCES gurus(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Enable RLS on all main tables
ALTER TABLE gurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswas ENABLE ROW LEVEL SECURITY;
ALTER TABLE kamars ENABLE ROW LEVEL SECURITY;
ALTER TABLE matapelajarans ENABLE ROW LEVEL SECURITY;
ALTER TABLE indikatorkehadirans ENABLE ROW LEVEL SECURITY;
ALTER TABLE indikator_sikap ENABLE ROW LEVEL SECURITY;
ALTER TABLE wali_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE riwayat_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE penempatan_kamar ENABLE ROW LEVEL SECURITY;
ALTER TABLE nilaiujians ENABLE ROW LEVEL SECURITY;
ALTER TABLE nilaihafalans ENABLE ROW LEVEL SECURITY;
ALTER TABLE kehadirans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nilai_sikap ENABLE ROW LEVEL SECURITY;
ALTER TABLE catatan_wali_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE raports ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin/guru/staff can access all data)
CREATE POLICY "authenticated_users_all_access" ON gurus FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON kelas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON siswas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON kamars FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON matapelajarans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON indikatorkehadirans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON indikator_sikap FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON wali_kelas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON riwayat_kelas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON penempatan_kamar FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON nilaiujians FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON nilaihafalans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON kehadirans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON nilai_sikap FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON catatan_wali_kelas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated_users_all_access" ON raports FOR ALL USING (auth.role() = 'authenticated');
