"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuranFoundation } from "@/hooks/use-quran-foundation";
import { toast } from "sonner"; 

interface ReadingProgressContextType {
    dailyGoal: number;
    setDailyGoal: (goal: number) => void;
    hasFinishedGoalMode: boolean;
    setHasFinishedGoalMode: (status: boolean) => void;
    hasSubmittedToday: boolean;
    submitActivity: (count: number, ranges: string[]) => Promise<void>;
}

const ReadingProgressContext = createContext<ReadingProgressContextType | undefined>(undefined);

export function ReadingProgressProvider({ children }: { children: React.ReactNode }) {
    const [dailyGoal, setDailyGoal] = useState(5);
    const [hasFinishedGoalMode, setHasFinishedGoalMode] = useState(false);
    const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
    
    const { logActivity, isConnected } = useQuranFoundation();

    // Initialize from local storage
    useEffect(() => {
        const savedGoal = localStorage.getItem("syamna_daily_goal");
        if (savedGoal) setDailyGoal(parseInt(savedGoal));

        const today = new Date().toISOString().split("T")[0];
        const savedDate = localStorage.getItem("syamna_read_date");
        const savedSubmitted = localStorage.getItem("syamna_submitted_today");
        const savedGoalMode = localStorage.getItem("syamna_goal_mode_finished");

        if (savedDate === today) {
            if (savedSubmitted) setHasSubmittedToday(savedSubmitted === "true");
            if (savedGoalMode) setHasFinishedGoalMode(savedGoalMode === "true");
        } else {
            // New day, reset progress
            setHasSubmittedToday(false);
            setHasFinishedGoalMode(false);
            localStorage.setItem("syamna_read_date", today);
            localStorage.setItem("syamna_submitted_today", "false");
            localStorage.setItem("syamna_goal_mode_finished", "false");
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

    const submitActivity = async (count: number, ranges: string[]) => {
        if (hasSubmittedToday || !isConnected) return;

        try {
            await logActivity.mutateAsync({
                date: new Date().toISOString().split("T")[0],
                type: "QURAN",
                seconds: count * 30, // Estimate 30 seconds per ayah
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
            submitActivity
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
