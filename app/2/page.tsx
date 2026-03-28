'use client'
import useTimer from "@/customHooks/useTimer"
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const { inhale, exhale, hold } = useTimer();
  const router = useRouter();

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col justify-center items-center min-h-screen bg-slate-950 text-white"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-extralight mb-4 tracking-tighter">Ready?</h1>
        <div className="flex gap-4 justify-center text-slate-400 font-mono text-sm mb-12">
          <span>In: {inhale}</span>
          <span>•</span>
          <span>Hold: {hold}</span>
          <span>•</span>
          <span>Out: {exhale}</span>
        </div>

        {/* Pulsing Start Button */}
        <motion.button 
          animate={{ boxShadow: ["0 0 0px rgba(59,130,246,0)", "0 0 20px rgba(59,130,246,0.4)", "0 0 0px rgba(59,130,246,0)"] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => router.push("/3")}
          className="w-32 h-32 rounded-full border border-blue-500 flex items-center justify-center group hover:bg-blue-500 transition-colors"
        >
          <span className="text-blue-500 group-hover:text-white font-bold tracking-widest">BEGIN</span>
        </motion.button>
      </motion.div>
    </motion.main>
  )
}