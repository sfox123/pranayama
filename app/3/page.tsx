'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTimer from '@/customHooks/useTimer'; 

type Phase = 'INHALE' | 'HOLD' | 'EXHALE';

const SessionPage: React.FC = () => {
  const { inhale, hold, exhale } = useTimer();
  
  // 1. State Management
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [phase, setPhase] = useState<Phase>('INHALE');
  const [secondsInPhase, setSecondsInPhase] = useState<number>(0);
  
  // Tracks half-cycles (In-Hold-Out). 2 half-cycles = 1 Round.
  const [halfCyclesDone, setHalfCyclesDone] = useState<number>(0);
  const [isLeftNostril, setIsLeftNostril] = useState<boolean>(true);
  
  const inhaleAudio = useRef<HTMLAudioElement | null>(null);
  const holdAudio = useRef<HTMLAudioElement | null>(null);
  const releaseAudio = useRef<HTMLAudioElement | null>(null);
  const bgAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const setupAudio = (src: string, loop = false, volume = 1) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.loop = loop;
      audio.volume = volume;
      return audio;
    };
    inhaleAudio.current = setupAudio('/inhale.mp3');
    holdAudio.current = setupAudio('/hold.mp3');
    releaseAudio.current = setupAudio('/release.mp3');
    bgAudio.current = setupAudio('/bg.mp3', true, 0.2);

    return () => bgAudio.current?.pause();
  }, []);

  const playSound = async (type: Phase | 'BG') => {
    if (type === 'BG') {
      try { await bgAudio.current?.play(); } catch (e) {}
      return;
    }
    [inhaleAudio, holdAudio, releaseAudio].forEach(ref => {
      if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
    });
    const target = type === 'INHALE' ? inhaleAudio.current : 
                   type === 'HOLD' ? holdAudio.current : releaseAudio.current;
    if (target) try { await target.play(); } catch (e) {}
  };

  // 3. Logic Engine
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && !isCompleted) {
      playSound('BG');
      if (totalSeconds === 0 && secondsInPhase === 0) playSound('INHALE');

      timer = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);

        setSecondsInPhase((prev) => {
          const currentLimit = phase === 'INHALE' ? inhale : phase === 'HOLD' ? hold : exhale;

          if (prev >= currentLimit - 1) {
            if (phase === 'INHALE') {
              setPhase('HOLD');
              playSound('HOLD');
              return 0;
            } else if (phase === 'HOLD') {
              setPhase('EXHALE');
              // Nadi Shodhana Rule: Switch nostril visibility DURING exhale
              setIsLeftNostril(prevN => !prevN);
              playSound('EXHALE');
              return 0;
            } else {
              // Exhale finished.
              const newHalfCycles = halfCyclesDone + 1;
              setHalfCyclesDone(newHalfCycles);

              // 20 half-cycles = 10 full rounds
              if (newHalfCycles >= 20) {
                setIsActive(false);
                setIsCompleted(true);
                bgAudio.current?.pause();
                return 0;
              }

              setPhase('INHALE');
              playSound('INHALE');
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      bgAudio.current?.pause();
    }

    return () => { if (timer) clearInterval(timer); };
  }, [isActive, phase, isCompleted, halfCyclesDone, inhale, hold, exhale, totalSeconds, secondsInPhase]);

  const resetSession = () => {
    setIsCompleted(false);
    setTotalSeconds(0);
    setPhase('INHALE');
    setSecondsInPhase(0);
    setHalfCyclesDone(0);
    setIsLeftNostril(true);
    setIsActive(true);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <h1 className="text-4xl font-thin tracking-widest mb-4">COMPLETED</h1>
          <p className="text-slate-500 mb-8 uppercase text-xs tracking-widest">10 Rounds of Nadi Shodhana Finished</p>
          <button onClick={resetSession} className="bg-white text-black px-10 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Restart</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 font-sans overflow-hidden">
      <div className={`fixed inset-0 opacity-10 transition-colors duration-1000 blur-[100px] -z-10 ${phase === 'INHALE' ? 'bg-blue-500' : phase === 'HOLD' ? 'bg-purple-500' : 'bg-emerald-500'}`} />

      {/* Nostril Switcher */}
      <div className="mb-12 flex items-center gap-6">
        <div className={`h-1.5 w-12 rounded-full transition-all duration-700 ${isLeftNostril ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800'}`} />
        <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase">{isLeftNostril ? "Inhale Left" : "Inhale Right"}</span>
        <div className={`h-1.5 w-12 rounded-full transition-all duration-700 ${!isLeftNostril ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800'}`} />
      </div>

      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center w-80 h-80">
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ scale: phase === 'INHALE' ? 0.7 : 1.4 }} animate={{ scale: phase === 'EXHALE' ? 0.7 : 1.4 }}
            transition={{ duration: phase === 'HOLD' ? 0 : (phase === 'INHALE' ? inhale : exhale), ease: "linear" }}
            className={`absolute w-full h-full border-[1px] rounded-full opacity-40 ${phase === 'INHALE' ? 'border-blue-400' : phase === 'HOLD' ? 'border-purple-400' : 'border-emerald-400'}`}
          />
        </AnimatePresence>
        <div className="text-center z-10">
          <motion.h2 key={secondsInPhase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-8xl font-thin font-mono mb-2">{secondsInPhase}</motion.h2>
          <p className="text-xs tracking-[0.5em] font-light uppercase text-slate-400">{phase}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-20 flex justify-between w-full max-w-xs border-t border-white/5 pt-10">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Total</p>
          <p className="text-xl font-mono text-slate-300">{Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, '0')}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Rounds</p>
          <p className="text-xl font-mono text-slate-300">{Math.floor(halfCyclesDone / 2)} / 10</p>
        </div>
      </div>

      <button onClick={() => setIsActive(!isActive)} className={`mt-14 w-full max-w-xs py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs border ${isActive ? 'bg-transparent text-red-500 border-red-900/50' : 'bg-white text-black'}`}>
        {isActive ? 'Pause' : 'Start Session'}
      </button>
    </div>
  );
};

export default SessionPage;