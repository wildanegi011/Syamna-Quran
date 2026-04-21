-- Migration to update iqro_levels table and seed all levels
BEGIN;

-- Add missing columns to iqro_levels
ALTER TABLE public.iqro_levels ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE public.iqro_levels ADD COLUMN IF NOT EXISTS is_disabled BOOLEAN DEFAULT false;

-- Seed all 6 levels with their corresponding titles, descriptions, and colors
INSERT INTO public.iqro_levels (level_number, title, description, color, is_disabled) VALUES
(1, 'Iqro 1', 'Huruf Hijaiyah Tunggal', 'bg-primary/20 text-primary border-primary/20', false),
(2, 'Iqro 2', 'Huruf Sambung & Mad Asli', 'bg-secondary/30 text-secondary-foreground border-secondary/20', true),
(3, 'Iqro 3', 'Kasrah, Dhammah & Sukun', 'bg-accent/30 text-accent-foreground border-accent/20', true),
(4, 'Iqro 4', 'Tanwin & Nun Mati', 'bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200/50', true),
(5, 'Iqro 5', 'Waqaf & Idgham', 'bg-primary/10 text-primary border-primary/10', true),
(6, 'Iqro 6', 'Hukum Mad & Quran', 'bg-primary/30 text-primary-foreground border-primary/30', true)
ON CONFLICT (level_number) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    color = EXCLUDED.color,
    is_disabled = EXCLUDED.is_disabled;

COMMIT;
