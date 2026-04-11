'use client';

import { Mic, ShieldCheck, Globe, Loader2, FileText, Activity } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { isRecording, startRecording, stopRecording, auditData, isProcessing } = useAudioRecorder();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fdfbf7] text-[#2c3e50] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-6xl font-extralight tracking-tight">Yukti</h1>
        <p className="text-gray-400 font-light max-w-md mx-auto">
          Ensuring linguistic justice through unbiased phonetic auditing.
        </p>
      </motion.div>

      <div className="mt-12 relative flex items-center justify-center">
        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-40 h-40 bg-teal-100 rounded-full"
          />
        )}
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center transition-transform ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          ) : (
            <Mic className={`w-10 h-10 ${isRecording ? 'text-teal-600' : 'text-slate-400'}`} />
          )}
        </button>
      </div>

      <div className="min-h-[200px] w-full max-w-2xl mt-8">
        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div
              key="loading-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-teal-100 p-8 rounded-2xl shadow-xl w-full flex flex-col items-center justify-center space-y-3"
            >
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-teal-700 font-medium tracking-wide animate-pulse">Auditing nuances...</p>
            </motion.div>
          )}
          {!isProcessing && auditData && auditData.transcript && (
            <motion.div 
              key="audit-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-teal-100 p-6 rounded-2xl shadow-xl space-y-4 w-full"
            >
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-teal-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider">Transcript</h3>
                  <p className="text-gray-700 mt-1 italic">&quot;{auditData.transcript}&quot;</p>
                </div>
              </div>
              <div className="border-t pt-4 flex items-start gap-4">
                <Activity className="w-5 h-5 text-teal-600 mt-1 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider">Linguistic Audit</h3>
                  <p className="text-gray-700 mt-1 leading-relaxed">{auditData.audit}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <span className="text-xs uppercase tracking-widest font-semibold">Bias Audit</span>
          <p className="text-center text-sm text-gray-400">Real-time correction for regional dialects.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Globe className="w-6 h-6 text-teal-600" />
          <span className="text-xs uppercase tracking-widest font-semibold">SDG 10.3</span>
          <p className="text-center text-sm text-gray-400">Promoting inclusion across all origins.</p>
        </div>
      </div>
    </main>
  );
}