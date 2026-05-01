"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuranFoundation } from "@/hooks/use-quran-foundation";
import { getQFReadingEstimate } from "@/lib/api/quran-foundation";
import { toast } from "sonner"; 

interface ReadingProgressContextType {
    dailyGoal: number;
    setDailyGoal: (goal: number) => void;
    hasFinishedGoalMode: boolean;
    setHasFinishedGoalMode: (status: boolean) => void;
    hasSubmittedToday: boolean;
    submitActivity: (count: number, ranges: string[]) => Promise<void>;
    readCount: number;
    incrementReadCount: () => void;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | undefined>(undefined);

export function ReadingProgressProvider({ children }: { children: React.ReactNode }) {
    const [dailyGoal, setDailyGoal] = useState(5);
    const [hasFinishedGoalMode, setHasFinishedGoalMode] = useState(false);
    const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
    const [readCount, setReadCount] = useState(0);
    
    const { logActivity, isConnected } = useQuranFoundation();

    // Initialize from local storage
    useEffect(() => {
        const savedGoal = localStorage.getItem("syamna_daily_goal");
        if (savedGoal) setDailyGoal(parseInt(savedGoal));

        const today = new Date().toISOString().split("T")[0];
        const savedDate = localStorage.getItem("syamna_read_date");
        const savedSubmitted = localStorage.getItem("syamna_submitted_today");
        const savedGoalMode = localStorage.getItem("syamna_goal_mode_finished");
        const savedReadCount = localStorage.getItem("syamna_read_count");

        if (savedDate === today) {
            if (savedSubmitted) setHasSubmittedToday(savedSubmitted === "true");
            if (savedGoalMode) setHasFinishedGoalMode(savedGoalMode === "true");
            if (savedReadCount) setReadCount(parseInt(savedReadCount) || 0);
        } else {
            // New day, reset progress
            setHasSubmittedToday(false);
            setHasFinishedGoalMode(false);
            setReadCount(0);
            localStorage.setItem("syamna_read_date", today);
            localStorage.setItem("syamna_submitted_today", "false");
            localStorage.setItem("syamna_goal_mode_finished", "false");
            localStorage.setItem("syamna_read_count", "0");
        }
    }, []);

    const handleSetDailyGoal = (goal: number) => {
        setDailyGoal(goal);
        localStorage.setItem("syamna_daily_goal", String(goal));
    };

    const handleSetFinishedGoalMode = (status: boolean) => {
        setHasFinishedGoalMode(status);
        localStorage.setItem("syamna_goal_mode_finished", String(status));
    };

    const incrementReadCount = () => {
        setReadCount(prev => {
            const next = prev + 1;
            localStorage.setItem("syamna_read_count", String(next));
            return next;
        });
    };

    const submitActivity = async (count: number, ranges: string[]) => {
        if (hasSubmittedToday || !isConnected) return;

        try {
            // Get official estimation from QF
            const estimatedSeconds = await getQFReadingEstimate(ranges);

            await logActivity.mutateAsync({
                date: new Date().toISOString().split("T")[0],
                type: "QURAN",
                seconds: Math.round(estimatedSeconds),
                ranges: ranges.length > 0 ? ranges : ["1:1-1:1"]
            });
            setHasSubmittedToday(true);
            handleSetFinishedGoalMode(true); // Automatically open the rest of the surah
            localStorage.setItem("syamna_submitted_today", "true");
            toast?.success("MasyaAllah! Target hari ini tercapai. Streak bertambah! ✨");
        } catch (error) {
            console.error("Failed to log activity to QF", error);
            // Even if API fails, let them read the rest
            handleSetFinishedGoalMode(true);
        }
    };

    return (
        <ReadingProgressContext.Provider value={{
            dailyGoal,
            setDailyGoal: handleSetDailyGoal,
            hasFinishedGoalMode,
            setHasFinishedGoalMode: handleSetFinishedGoalMode,
            hasSubmittedToday,
            submitActivity,
            readCount,
            incrementReadCount
        }}>
            {children}
        </ReadingProgressContext.Provider>
    );
}

export function useReadingProgress() {
    const context = useContext(ReadingProgressContext);
    if (context === undefined) {
        throw new Error("useReadingProgress must be used within a ReadingProgressProvider");
    }
    return context;
}
