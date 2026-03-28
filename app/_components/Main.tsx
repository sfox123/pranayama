'use client'
import useTimer from '@/customHooks/useTimer';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Page() {
  const { inhale, exhale, hold, setInhale } = useTimer();
  const router = useRouter();

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-slate-200 px-6"
    >
      <span className="text-blue-500 font-mono mb-2">Step 01</span>
      <h1 className="text-4xl font-light tracking-widest mb-12 uppercase">Pranayama</h1>

      <div className="w-full max-w-xs space-y-8">
        <div className="flex flex-col">
          <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Inhale Duration (sec)</label>
          <input 
            type="number" 
            value={inhale} 
            onChange={(e) => setInhale(Number(e.target.value))}
            className="bg-slate-900 border border-slate-800 rounded-lg py-4 px-6 text-2xl focus:border-blue-500 focus:outline-none transition-all text-center"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Hold</p>
            <p className="text-xl">{hold}s</p>
          </div>
          <div className="text-center p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Exhale</p>
            <p className="text-xl">{exhale}s</p>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/2")}
        className="mt-16 bg-white text-black px-12 py-4 rounded-full font-bold tracking-widest uppercase text-sm shadow-lg shadow-white/10"
      >
        Set Routine
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/anapanasati")}
        className="mt-4 bg-transparent border border-white text-white px-12 py-4 rounded-full font-bold tracking-widest uppercase text-sm shadow-lg shadow-white/10 hover:bg-white hover:text-black transition-colors cursor-pointer"
      >
        Anapanasati
      </motion.button>
    </motion.main>
  );
}