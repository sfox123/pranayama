'use client';

import { useState, useMemo, ReactNode } from "react";
import { TimerContext } from "./TimerContext"; 

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [inhale, setInhale] = useState(4);
    
    const value = useMemo(() => {
        const exhale = inhale * 2;
        const hold = exhale * 2;

        return {
            inhale,
            exhale,
            hold,
            setInhale
        };
    }, [inhale]);

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
};