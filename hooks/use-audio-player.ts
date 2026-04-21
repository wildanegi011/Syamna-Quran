import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseAudioPlayerOptions {
    onEnded?: () => void;
    onError?: (error: any) => void;
}

export function useAudioPlayer(options: UseAudioPlayerOptions = {}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const optionsRef = useRef(options);

    // Keep options up to date without triggering re-renders or hook dependency changes
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
            audioRef.current = null;
        }
        setIsPlaying(false);
    }, []);

    const play = useCallback((url: string) => {
        if (!url) return;

        stop();

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
            setIsPlaying(false);
            optionsRef.current.onEnded?.();
        };

        audio.onerror = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
            optionsRef.current.onError?.(e);
        };

        // Call play() immediately within the same call stack as the user interaction
        const promise = audio.play();
        if (promise !== undefined) {
            promise
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    console.error("Audio playback promise error:", error);
                    setIsPlaying(false);
                    optionsRef.current.onError?.(error);
                });
        }
    }, [stop]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return {
        isPlaying,
        play,
        stop
    };
}
