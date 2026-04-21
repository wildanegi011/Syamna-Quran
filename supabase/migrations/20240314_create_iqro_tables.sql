-- Create table for Iqro Levels
CREATE TABLE IF NOT EXISTS public.iqro_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    basmallah TEXT, -- Added for Iqro basmallah
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for Iqro Pages
CREATE TABLE IF NOT EXISTS public.iqro_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID REFERENCES public.iqro_levels(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    name TEXT, -- Added for page name like "أَ بَ"
    sections JSONB NOT NULL, -- Renamed from content to match data structure: [{ section_id: number, text: string, latin?: string, audioUrl?: string }]
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(level_id, page_number)
);

-- Create table for User Progress
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    level_id UUID REFERENCES public.iqro_levels(id),
    page_id UUID REFERENCES public.iqro_pages(id),
    status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed'
    stars INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, page_id)
);

-- Row Level Security (RLS)
ALTER TABLE public.iqro_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iqro_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for iqro_levels" ON public.iqro_levels FOR SELECT USING (true);
CREATE POLICY "Public read access for iqro_pages" ON public.iqro_pages FOR SELECT USING (true);
CREATE POLICY "Users can manage their own progress" ON public.user_progress 
    FOR ALL USING (auth.uid() = user_id);

-- Sample Data for Level 1
INSERT INTO public.iqro_levels (level_number, title, description) 
VALUES (1, 'Iqro 1', 'Mengenal huruf hijaiyah tunggal berharakat fathah.');
