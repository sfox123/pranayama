'use client';
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Anapanasati() {
    const [minutes, setMinutes] = useState<number>(15);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Audio Ref
    const bgAudio = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        bgAudio.current = new Audio('/bg_two.mp3');
        bgAudio.current.loop = true;
        bgAudio.current.volume = 0.3;

        return () => {
            bgAudio.current?.pause();
        };
    }, []);

    const totalSeconds = minutes * 60;
    const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            bgAudio.current?.pause();
        }
        return () => clearTimeout(timer);
    }, [isRunning, timeLeft]);

    const handleStart = async () => {
        setTimeLeft(minutes * 60);
        setIsRunning(true);
        try {
            if (bgAudio.current) {
                bgAudio.current.currentTime = 0;
                await bgAudio.current.play();
            }
        } catch (err) {
            console.warn("Audio playback blocked by browser", err);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        bgAudio.current?.pause();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <main className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-slate-200 px-6 font-sans overflow-hidden">
            {/* Ambient Background Glow */}
            <div className={`fixed inset-0 transition-opacity duration-1000 bg-blue-900/10 blur-[120px] -z-10 ${isRunning ? 'opacity-100' : 'opacity-0'}`} />

            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-extralight tracking-[0.3em] mb-12 uppercase text-blue-100/80"
            >
                Anapanasati
            </motion.h1>

            <div className="relative mb-12 flex items-center justify-center">
                <svg width="300" height="300" className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(30,41,59,0.5)]">
                    {/* Background Circle */}
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-slate-900"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ ease: "linear", duration: 1 }}
                        className="text-blue-500"
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!isRunning ? (
                            <motion.div 
                                key="input"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <input
                                    type="number"
                                    value={minutes}
                                    onChange={(e) => setMinutes(Number(e.target.value))}
                                    className="bg-transparent border-none text-6xl font-extralight text-center text-white focus:outline-none w-32 font-mono"
                                    min="1"
                                />
                                <span className="text-[10px] tracking-[0.4em] text-slate-500 uppercase mt-2">Minutes</span>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="timer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-5xl font-extralight font-mono text-blue-100"
                            >
                                {formatTime(timeLeft)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRunning ? handleStop : handleStart}
                className={`px-16 py-4 rounded-full font-bold tracking-[0.2em] uppercase text-xs transition-all duration-500 border ${
                    isRunning 
                    ? 'border-slate-800 text-slate-500 hover:bg-slate-900/50' 
                    : 'bg-white text-black border-white shadow-xl shadow-white/5'
                }`}
            >
                {isRunning ? 'End Session' : 'Start Meditation'}
            </motion.button>
            
            <p className="mt-8 text-[10px] tracking-[0.2em] text-slate-600 uppercase font-medium">
                Breath is the anchor to the present moment
            </p>
        </main>
    );
}