"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Ayah, SurahSummary } from '@/lib/types';
import { getSurahDetail } from '@/lib/quran';
import surahSummaryData from '@/lib/data/surahs.json';

interface AudioStateContextType {
    currentAyah: Ayah | null;
    currentSurah: SurahSummary | null;
    isPlaying: boolean;
    volume: number;
    queue: Ayah[];
    playAyah: (ayah: Ayah, surah: SurahSummary, queue?: Ayah[], juzId?: number | null) => Promise<void>;
    togglePlay: () => void;
    stopAudio: () => void;
    nextAyah: () => void;
    prevAyah: () => void;
    setVolume: (volume: number) => void;
    seek: (percent: number) => void;
    autoNext: boolean;
    setAutoNext: (val: boolean) => void;
    selectedReciterId: string;
    setReciterId: (id: string) => void;
    repeatMode: 'off' | 'one' | 'all';
    toggleRepeatMode: () => void;
    isShuffle: boolean;
    toggleShuffle: () => void;
    isRightPanelOpen: boolean;
    setRightPanelOpen: (val: boolean) => void;
    playSurah: (surahNumber: number) => Promise<void>;
    favorites: string[];
    toggleFavorite: (surahId: number, ayahId: number) => void;
    isFavorite: (surahId: number, ayahId: number) => boolean;
    setCurrentSurah: (surah: SurahSummary | null, keepJuz?: boolean) => void;
    currentJuz: number | null;
    setCurrentJuz: (juz: number | null) => void;
    viewedSurah: SurahSummary | null;
    setViewedSurah: (surah: SurahSummary | null) => void;
    viewedJuz: number | null;
    setViewedJuz: (juz: number | null) => void;
    isUsingFallback: boolean;
}

interface AudioProgressContextType {
    progress: number;
    duration: number;
}

const AudioStateContext = createContext<AudioStateContextType | undefined>(undefined);
const AudioProgressContext = createContext<AudioProgressContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
    const [currentSurah, setCurrentSurah] = useState<SurahSummary | null>({
        nomor: 1,
        nama: "الفاتحة",
        namaLatin: "Al-Fatihah",
        arti: "Pembukaan",
        jumlahAyat: 7,
        tempatTurun: "Mekah",
        deskripsi: "",
        audioFull: {}
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.7);
    const [queue, setQueue] = useState<Ayah[]>([]);
    const [shuffledQueue, setShuffledQueue] = useState<Ayah[]>([]);
    const [autoNext, setAutoNext] = useState(true);
    const [selectedReciterId, setSelectedReciterId] = useState('ar.alafasy');
    const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRightPanelOpen, setRightPanelOpen] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [currentJuz, setCurrentJuzState] = useState<number | null>(null);
    const [viewedSurah, setViewedSurahState] = useState<SurahSummary | null>(null);
    const [viewedJuz, setViewedJuzState] = useState<number | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playPromiseRef = useRef<Promise<void> | null>(null);
    const fallbackSourcesRef = useRef<string[]>([]);
    const fallbackIndexRef = useRef<number>(0);
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    // Load initial settings
    useEffect(() => {
        const savedReciter = localStorage.getItem('syamna_quran_reciter');
        if (savedReciter) {
            const legacyMap: Record<string, string> = {
                "01": "ar.juhany", "02": "ar.muhsin", "03": "ar.abdurrahmaansudais",
                "04": "ar.ibrahimaldossari", "05": "ar.alafasy", "06": "ar.yasseraldossari"
            };
            setSelectedReciterId(legacyMap[savedReciter] || savedReciter);
        }
        const savedAutoNext = localStorage.getItem('syamna_quran_autonext');
        if (savedAutoNext !== null) setAutoNext(savedAutoNext === 'true');
        const savedRepeatMode = localStorage.getItem('syamna_quran_repeat_mode');
        if (savedRepeatMode) setRepeatMode(savedRepeatMode as any);
        const savedShuffle = localStorage.getItem('syamna_quran_shuffle');
        if (savedShuffle) setIsShuffle(savedShuffle === 'true');
        const savedFavorites = localStorage.getItem('syamna_quran_favorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

        const savedNowPlaying = localStorage.getItem('syamna_now_playing');
        if (savedNowPlaying) setCurrentSurah(JSON.parse(savedNowPlaying));

        const savedJuz = localStorage.getItem('syamna_current_juz');
        if (savedJuz) setCurrentJuzState(parseInt(savedJuz));

        const savedViewedSurah = localStorage.getItem('syamna_viewed_surah');
        if (savedViewedSurah) setViewedSurahState(JSON.parse(savedViewedSurah));

        const savedViewedJuz = localStorage.getItem('syamna_viewed_juz');
        if (savedViewedJuz) setViewedJuzState(parseInt(savedViewedJuz));
    }, []);

    // Sync viewed content with currently playing content (Play-to-Read)
    const syncView = useCallback((ayah: Ayah, surah: SurahSummary, juzId: number | null) => {
        if (juzId) {
            setViewedJuzState(juzId);
            localStorage.setItem('syamna_viewed_juz', String(juzId));
            
            // Still update the viewed surah state internally for metadata fallback, 
            // but we don't clear the viewedJuzState.
            setViewedSurahState(surah);
            localStorage.setItem('syamna_viewed_surah', JSON.stringify(surah));
        } else {
            setViewedSurahState(surah);
            localStorage.setItem('syamna_viewed_surah', JSON.stringify(surah));
            
            setViewedJuzState(null);
            localStorage.removeItem('syamna_viewed_juz');
        }
    }, []);

    // Save settings helpers
    const setReciterId = useCallback((id: string) => {
        setSelectedReciterId(id);
        localStorage.setItem('syamna_quran_reciter', id);
    }, []);

    const setAutoNextPersisted = useCallback((val: boolean) => {
        setAutoNext(val);
        localStorage.setItem('syamna_quran_autonext', String(val));
    }, []);

    const toggleRepeatMode = useCallback(() => {
        setRepeatMode(prev => {
            const next = prev === 'off' ? 'one' : prev === 'one' ? 'all' : 'off';
            localStorage.setItem('syamna_quran_repeat_mode', next);
            return next;
        });
    }, []);

    const toggleShuffle = useCallback(() => {
        setIsShuffle(prev => {
            const next = !prev;
            localStorage.setItem('syamna_quran_shuffle', String(next));
            if (next && queue.length > 0) {
                const shuffled = [...queue].sort(() => Math.random() - 0.5);
                setShuffledQueue(shuffled);
            }
            return next;
        });
    }, [queue]);

    const toggleFavorite = useCallback((surahId: number, ayahId: number) => {
        const key = `${surahId}-${ayahId}`;
        setFavorites(prev => {
            const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
            localStorage.setItem('syamna_quran_favorites', JSON.stringify(next));
            return next;
        });
    }, []);

    const setCurrentJuz = useCallback((juz: number | null) => {
        setCurrentJuzState(juz);
        if (juz) localStorage.setItem('syamna_current_juz', String(juz));
        else localStorage.removeItem('syamna_current_juz');
    }, []);

    const setViewedSurah = useCallback((surah: SurahSummary | null) => {
        setViewedSurahState(surah);
        if (surah) {
            localStorage.setItem('syamna_viewed_surah', JSON.stringify(surah));
            setViewedJuzState(null); // Clear juz view when viewing a specific surah
            localStorage.removeItem('syamna_viewed_juz');
        } else {
            localStorage.removeItem('syamna_viewed_surah');
        }
    }, []);

    const setViewedJuz = useCallback((juz: number | null) => {
        setViewedJuzState(juz);
        if (juz) {
            localStorage.setItem('syamna_viewed_juz', String(juz));
            setViewedSurahState(null); // Clear surah view when viewing a juz
            localStorage.removeItem('syamna_viewed_surah');
        } else {
            localStorage.removeItem('syamna_viewed_juz');
        }
    }, []);

    const isFavorite = useCallback((surahId: number, ayahId: number) => {
        return favorites.includes(`${surahId}-${ayahId}`);
    }, [favorites]);

    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;

        const handleTimeUpdate = () => {
            if (audioRef.current) {
                const now = Date.now();
                if (now - lastUpdateRef.current > 250) {
                    const current = audioRef.current.currentTime;
                    const total = audioRef.current.duration;
                    if (!isNaN(total)) {
                        setProgress((current / total) * 100);
                        setDuration(total);
                        lastUpdateRef.current = now;
                    }
                }
            }
        };

        const handleAudioError = async () => {
            if (!audioRef.current) return;
            
            // If the source is empty or just the window URL, it's not a real playback error
            const src = audioRef.current.src;
            if (!src || src === window.location.href || src === "about:blank") return;
            
            // If we have no sources to fallback to, we are likely in a stopped state
            if (fallbackSourcesRef.current.length === 0) return;

            const error = audioRef.current.error;
            console.warn(`Audio source failed to load: ${src}`, error);

            fallbackIndexRef.current++;
            if (fallbackIndexRef.current < fallbackSourcesRef.current.length) {
                const nextSrc = fallbackSourcesRef.current[fallbackIndexRef.current];
                console.info(`Attempting fallback source ${fallbackIndexRef.current + 1}/${fallbackSourcesRef.current.length}: ${nextSrc}`);
                
                setIsUsingFallback(true);
                audioRef.current.pause();
                audioRef.current.src = nextSrc;
                audioRef.current.load();
                
                try {
                    await safePlay();
                } catch (e) {
                    console.error("Fallback attempt failed:", e);
                }
            } else {
                // If we've reached here, it means we really tried all sources and failed
                // But only report if it wasn't a manual stop (which clears fallbackSources)
                console.error("All audio sources failed. Playback stopped.");
                setIsPlaying(false);
                setIsUsingFallback(false);
            }
        };

        const audio = audioRef.current;
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('error', handleAudioError);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('error', handleAudioError);
            audio.pause();
            audio.src = "";
        };
    }, []);

    const safePlay = useCallback(async () => {
        if (!audioRef.current) return;
        try {
            if (playPromiseRef.current) await playPromiseRef.current;
            const promise = audioRef.current.play();
            playPromiseRef.current = promise;
            if (promise !== undefined) await promise;
        } catch (error: any) {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                console.error("Audio playback error:", error);
            }
        } finally {
            playPromiseRef.current = null;
        }
    }, []);

    const playAyah = useCallback(async (ayah: Ayah, surah: SurahSummary, newQueue?: Ayah[], juzId?: number | null) => {
        if (!audioRef.current) return;
        
        // Handle Juz context synchronization
        const activeJuzId = juzId !== undefined ? juzId : currentJuz;
        if (juzId !== undefined) {
            setCurrentJuzState(juzId);
            if (juzId) localStorage.setItem('syamna_current_juz', String(juzId));
            else localStorage.removeItem('syamna_current_juz');
        }
        
        // Reset fallback logic
        setIsUsingFallback(false);
        fallbackIndexRef.current = 0;
        
        // Build potential sources list
        const sources: string[] = [];
        
        // 1. Primary from API
        if (ayah.audio[selectedReciterId]) sources.push(ayah.audio[selectedReciterId]);
        
        // 2. Secondary from CDN (Islamic Network)
        if (ayah.numberGlobal) {
            sources.push(`https://cdn.islamic.network/quran/audio/128/${selectedReciterId}/${ayah.numberGlobal}.mp3`);
        }
        
        // 3. Tertiary (Legacy keys from state)
        if (ayah.audio['05']) sources.push(ayah.audio['05']);
        if (ayah.audio['01']) sources.push(ayah.audio['01']);
        
        // 4. Ultimate Fallback (Default stable reciter - Al-Afasy)
        if (selectedReciterId !== 'ar.alafasy' && ayah.numberGlobal) {
            sources.push(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.numberGlobal}.mp3`);
        }
        
        // Remove duplicates
        fallbackSourcesRef.current = [...new Set(sources)];
        
        if (fallbackSourcesRef.current.length === 0) {
            console.error("No audio sources available for this ayah.");
            return;
        }

        if (currentAyah?.nomorAyat === ayah.nomorAyat && currentSurah?.nomor === surah.nomor) {
            // If it's a data update (e.g. new audio URLs arrived from API), just update the state
            setCurrentAyah(ayah);
            return;
        }

        if (playPromiseRef.current) {
            try { await playPromiseRef.current; } catch (e) { }
        }

        audioRef.current.pause();
        audioRef.current.src = fallbackSourcesRef.current[0];
        audioRef.current.load();
        setCurrentAyah(ayah);
        setCurrentSurah(surah);
        setIsPlaying(true);
        
        // Sync view with playback
        syncView(ayah, surah, activeJuzId);
        
        if (newQueue) {
            setQueue(newQueue);
            if (isShuffle) setShuffledQueue([...newQueue].sort(() => Math.random() - 0.5));
        }
        
        await safePlay();
    }, [currentAyah, currentSurah, selectedReciterId, safePlay, isShuffle, syncView, currentJuz]);

    const playSurah = useCallback(async (surahNumber: number) => {
        try {
            const detail = await getSurahDetail(surahNumber, [selectedReciterId]);
            if (detail && detail.ayat.length > 0) {
                setCurrentJuz(null); // Clear Juz when playing a specific surah
                await playAyah(detail.ayat[0], detail, detail.ayat, null);
                setRightPanelOpen(true);
            }
        } catch (error) {
            console.error("Failed to play surah:", error);
        }
    }, [selectedReciterId, playAyah]);

    const togglePlay = useCallback(async () => {
        if (!audioRef.current) return;

        // If nothing is playing but we are viewing something, start playing it
        if (!currentAyah) {
            if (viewedSurah) {
                await playSurah(viewedSurah.nomor);
            } else if (viewedJuz) {
                // Handle Juz playback logic here if needed
            }
            return;
        }

        if (isPlaying) {
            if (playPromiseRef.current) {
                try { await playPromiseRef.current; } catch (e) { }
            }
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            await safePlay();
        }
    }, [isPlaying, currentAyah, viewedSurah, viewedJuz, playSurah, safePlay]);

    const stopAudio = useCallback(() => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current.load(); // Ensure source is cleared
        }
        setCurrentAyah(null);
        // Clear fallbacks
        fallbackSourcesRef.current = [];
        fallbackIndexRef.current = 0;
    }, []);

    const getCurrentQueue = useCallback(() => {
        return isShuffle && shuffledQueue.length > 0 ? shuffledQueue : queue;
    }, [isShuffle, shuffledQueue, queue]);

    const nextAyah = useCallback(() => {
        const activeQueue = getCurrentQueue();
        if (!currentAyah || activeQueue.length === 0) return;

        const currentIndex = activeQueue.findIndex(a =>
            a.numberGlobal === currentAyah.numberGlobal ||
            (a.nomorAyat === currentAyah.nomorAyat && a.surahInfo?.nomor === currentAyah.surahInfo?.nomor)
        );

        if (currentIndex < activeQueue.length - 1) {
            const next = activeQueue[currentIndex + 1];
            let nextSurah = currentSurah;

            if (currentJuz && next.surahInfo && next.surahInfo.nomor !== currentSurah?.nomor) {
                const found = (surahSummaryData as any[]).find(s => s.nomor === next.surahInfo?.nomor);
                if (found) nextSurah = found;
            }

            playAyah(next, nextSurah!);
        } else if (repeatMode === 'all') {
            const first = activeQueue[0];
            let firstSurah = currentSurah;
            if (currentJuz && first.surahInfo && first.surahInfo.nomor !== currentSurah?.nomor) {
                const found = (surahSummaryData as any[]).find(s => s.nomor === first.surahInfo?.nomor);
                if (found) firstSurah = found;
            }
            playAyah(first, firstSurah!);
        } else {
            setIsPlaying(false);
        }
    }, [currentAyah, getCurrentQueue, currentSurah, playAyah, repeatMode, currentJuz]);

    const prevAyah = useCallback(() => {
        const activeQueue = getCurrentQueue();
        if (!currentAyah || activeQueue.length === 0) return;

        const currentIndex = activeQueue.findIndex(a =>
            a.numberGlobal === currentAyah.numberGlobal ||
            (a.nomorAyat === currentAyah.nomorAyat && a.surahInfo?.nomor === currentAyah.surahInfo?.nomor)
        );

        if (currentIndex > 0) {
            const prev = activeQueue[currentIndex - 1];
            let prevSurah = currentSurah;

            if (currentJuz && prev.surahInfo && prev.surahInfo.nomor !== currentSurah?.nomor) {
                const found = (surahSummaryData as any[]).find(s => s.nomor === prev.surahInfo?.nomor);
                if (found) prevSurah = found;
            }

            playAyah(prev, prevSurah!);
        } else if (repeatMode === 'all') {
            const last = activeQueue[activeQueue.length - 1];
            let lastSurah = currentSurah;
            if (currentJuz && last.surahInfo && last.surahInfo.nomor !== currentSurah?.nomor) {
                const found = (surahSummaryData as any[]).find(s => s.nomor === last.surahInfo?.nomor);
                if (found) lastSurah = found;
            }
            playAyah(last, lastSurah!);
        }
    }, [currentAyah, getCurrentQueue, currentSurah, playAyah, repeatMode, currentJuz]);

    const setVolume = useCallback((val: number) => {
        if (audioRef.current) {
            audioRef.current.volume = val;
            setVolumeState(val);
        }
    }, []);

    const seek = useCallback((percent: number) => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const time = (percent / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setProgress(percent);
        }
    }, []);

    useEffect(() => {
        const switchReciter = async () => {
            if (isPlaying && currentAyah && audioRef.current && currentSurah) {
                // IMPORTANT: Only switch if the URL exists in the current data.
                // This prevents the "no supported source" error during the race condition
                // where the ID changes but the API data hasn't arrived yet.
                let audioUrl = currentAyah.audio[selectedReciterId];

                if (audioUrl && audioRef.current.src !== audioUrl) {
                    if (playPromiseRef.current) try { await playPromiseRef.current; } catch (e) { }
                    audioRef.current.pause();
                    audioRef.current.src = audioUrl;
                    audioRef.current.load();
                    await safePlay();
                }
            }
        };
        switchReciter();
    }, [selectedReciterId, currentAyah, isPlaying, currentSurah, safePlay]);

    useEffect(() => {
        if (!audioRef.current) return;
        const handleEnded = () => {
            if (!audioRef.current || !audioRef.current.src || audioRef.current.src === window.location.href) return;
            
            if (repeatMode === 'one') {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    safePlay();
                }
            } else {
                if (autoNext) nextAyah();
                else setIsPlaying(false);
            }
        };
        const audio = audioRef.current;
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [currentAyah, nextAyah, autoNext, repeatMode, safePlay]);

    // Memoized Context Values
    const stateValue = React.useMemo(() => ({
        currentAyah, currentSurah, isPlaying, volume, queue,
        playAyah, togglePlay, stopAudio, nextAyah, prevAyah, setVolume, seek,
        autoNext, setAutoNext: setAutoNextPersisted,
        selectedReciterId, setReciterId,
        repeatMode, toggleRepeatMode,
        isShuffle, toggleShuffle,
        isRightPanelOpen, setRightPanelOpen,
        playSurah,
        favorites, toggleFavorite, isFavorite,
        setCurrentSurah: (surah: SurahSummary | null, keepJuz: boolean = false) => {
            setCurrentSurah(surah);
            if (!keepJuz) setCurrentJuz(null);
            if (surah) {
                localStorage.setItem('syamna_now_playing', JSON.stringify(surah));
            }
        },
        currentJuz,
        setCurrentJuz,
        viewedSurah,
        setViewedSurah,
        viewedJuz,
        setViewedJuz,
        isUsingFallback
    }), [
        currentAyah, currentSurah, isPlaying, volume, queue,
        playAyah, togglePlay, stopAudio, nextAyah, prevAyah, setVolume, seek,
        autoNext, setAutoNextPersisted,
        selectedReciterId, setReciterId,
        repeatMode, toggleRepeatMode,
        isShuffle, toggleShuffle,
        isRightPanelOpen, setRightPanelOpen,
        playSurah,
        favorites, toggleFavorite, isFavorite,
        setCurrentSurah,
        currentJuz,
        setCurrentJuz,
        viewedSurah,
        setViewedSurah,
        viewedJuz,
        setViewedJuz,
        isUsingFallback
    ]);

    const progressValue = React.useMemo(() => ({
        progress, duration
    }), [progress, duration]);

    return (
        <AudioStateContext.Provider value={stateValue}>
            <AudioProgressContext.Provider value={progressValue}>
                {children}
            </AudioProgressContext.Provider>
        </AudioStateContext.Provider>
    );
}

export function useAudio() {
    const stateContext = useContext(AudioStateContext);
    const progressContext = useContext(AudioProgressContext);
    if (stateContext === undefined || progressContext === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    // Return combined object for backward compatibility, 
    // but the stateContext is now memoized separately.
    return { ...stateContext, ...progressContext };
}

// Optimized hook for components that DON'T need progress (like Sidebar, Navbar)
export function useAudioState() {
    const context = useContext(AudioStateContext);
    if (context === undefined) throw new Error('useAudioState must be used within an AudioProvider');
    return context;
}

// Optimized hook for components that ONLY need progress (like Progress Bar)
export function useAudioProgress() {
    const context = useContext(AudioProgressContext);
    if (context === undefined) throw new Error('useAudioProgress must be used within an AudioProvider');
    return context;
}
