-- Migration to create app_modules table and seed initial data
BEGIN;

CREATE TABLE IF NOT EXISTS public.app_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    href TEXT NOT NULL,
    color TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.app_modules ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Public read access for app_modules" ON public.app_modules FOR SELECT USING (true);

-- Seed data from MODULES constant in lib/constants.ts
INSERT INTO public.app_modules (title, description, icon, href, color, display_order) VALUES
('Iqro', 'Belajar membaca Hijaiyah dari dasar dengan metode yang mudah.', '📖', '/iqro', 'bg-primary/10', 1),
('Al-Quran', 'Baca dan pelajari kitab suci dengan terjemahan lengkap.', '🌙', '#', 'bg-secondary/20', 2),
('Hadist', 'Kumpulan sabda Rasulullah SAW sebagai pedoman hidup.', '📜', '#', 'bg-accent/20', 3),
('Sirah Nabawiyah', 'Kisah perjalanan hidup Nabi Muhammad SAW yang inspiratif.', '🕌', '#', 'bg-slate-200/50 dark:bg-slate-800/50', 4)
ON CONFLICT (title) DO UPDATE SET
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    href = EXCLUDED.href,
    color = EXCLUDED.color,
    display_order = EXCLUDED.display_order;

COMMIT;
