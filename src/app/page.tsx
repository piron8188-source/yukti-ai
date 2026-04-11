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
        <h1 className="text-6xl font-bold tracking-[0.15em] text-[#2D3748] uppercase mb-2">Yukti</h1>
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
                className="bg-white border border-teal-100 p-8 rounded-2xl shadow-xl w-full flex flex-col items-center justify-center"
                >
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
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider flex items-center justify-between">
                    Linguistic Audit
                    {auditData.equity_score !== undefined && (
                      <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full border border-teal-200">Score: {Number(auditData.equity_score).toFixed(1)}</span>
                    )}
                  </h3>
                  {/* Smart Rendering: Handle both object and string responses from Gemini */}
                  {typeof auditData.audit === 'object' && auditData.audit !== null ? (
                    <div className="mt-4 space-y-3">
                      {auditData.audit.accent_identified && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Identified Accent</p>
                          <p className="text-sm text-slate-800 mt-1">{auditData.audit.accent_identified}</p>
                        </div>
                      )}
            
                      {auditData.audit.features && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phonetic Features</p>
                          <p className="text-sm text-slate-800 mt-1">{auditData.audit.features}</p>
                        </div>
                      )}
            
                      {auditData.audit.potential_bias_analysis && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                          <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Bias Analysis</p>
                          <p className="text-sm text-red-900 mt-1">{auditData.audit.potential_bias_analysis}</p>
                        </div>
                      )}
            
                      {/* Fallback to recommendation if the object is structured differently */}
                      {!auditData.audit.accent_identified && auditData.recommendation && (
                        <p className="text-gray-700 mt-2 leading-relaxed text-sm">{auditData.recommendation}</p>
                      )}
                    </div>
                  ) : (
                    /* Fallback if the model returns a standard string */
                    <div className="mt-3">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {typeof auditData.audit === 'string' ? auditData.audit : auditData.recommendation}
                      </p>
                    </div>
                  )}
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