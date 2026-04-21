-- Migration to create hijaiyah_letters table and seed initial data
BEGIN;

CREATE TABLE IF NOT EXISTS public.hijaiyah_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id INTEGER NOT NULL UNIQUE,
    arabic TEXT NOT NULL,
    latin TEXT NOT NULL,
    audio_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.hijaiyah_letters ENABLE ROW LEVEL SECURITY;

-- Create public read policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hijaiyah_letters' 
        AND policyname = 'Public read access for hijaiyah_letters'
    ) THEN
        CREATE POLICY "Public read access for hijaiyah_letters" ON public.hijaiyah_letters FOR SELECT USING (true);
    END IF;
END
$$;

-- Seed data from original hijaiyah-letters.json with audio_key mappings
INSERT INTO public.hijaiyah_letters (order_id, arabic, latin, audio_key) VALUES
(1, 'ا', 'Alif', 'ALIF'),
(2, 'ب', 'Ba', 'BA'),
(3, 'ت', 'Ta', 'TA'),
(4, 'ث', 'Tsa', 'TSA'),
(5, 'ج', 'Jim', 'JIM'),
(6, 'ح', 'Ha', 'HA'),
(7, 'خ', 'Kha', 'KHA'),
(8, 'د', 'Dal', 'DAL'),
(9, 'ذ', 'Dzal', 'DZAL'),
(10, 'ر', 'Ra', 'RA'),
(11, 'ز', 'Zai', 'ZAI'),
(12, 'س', 'Sin', 'SIN'),
(13, 'ش', 'Syin', 'SYIN'),
(14, 'ص', 'Shad', 'SHAD'),
(15, 'ض', 'Dhad', 'DHAD'),
(16, 'ط', 'Tha', 'THA'),
(17, 'ظ', 'Dza', 'ZHO'),
(18, 'ع', 'Ain', 'AIN'),
(19, 'غ', 'Ghain', 'GHAIN'),
(20, 'ف', 'Fa', 'FA'),
(21, 'ق', 'Qaf', 'QAF'),
(22, 'ك', 'Kaf', 'KAF'),
(23, 'ل', 'Lam', 'LAM'),
(24, 'م', 'Mim', 'MIM'),
(25, 'ن', 'Nun', 'NUN'),
(26, 'و', 'Wau', 'WAU'),
(27, 'ه', 'Ha', 'HA2'),
(28, 'لا', 'Lam Alif', 'LAM ALIF'),
(29, 'ء', 'Hamzah', 'HAMZAH'),
(30, 'ي', 'Ya', 'YA')
ON CONFLICT (order_id) DO UPDATE SET
    arabic = EXCLUDED.arabic,
    latin = EXCLUDED.latin,
    audio_key = EXCLUDED.audio_key;

COMMIT;
