'use client';

import { Mic, ShieldCheck, Globe, Loader2, FileText, Activity } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { motion, AnimatePresence } from 'framer-motion';
import { PipelineVisualizer } from '@/components/PipelineVisualizer';

export default function Home() {
  const { isRecording, startRecording, stopRecording, auditData, isProcessing, pipelineStage } = useAudioRecorder();
  const isComplete = !isProcessing && auditData !== null;

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

      <div className="w-full max-w-2xl mt-8 flex flex-col items-center gap-6">
        <PipelineVisualizer isProcessing={isProcessing} isComplete={isComplete} currentStage={pipelineStage} />
        <div className="w-full">
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
                  <div className="mt-1 flex flex-wrap gap-1">
                    {auditData.word_risks && auditData.word_risks.length > 0
                      ? auditData.word_risks.map((item: { word: string; risk: number; language?: string }, index: number) => {
                          const risk = item.risk;
                          const languageMap: Record<string, string> = {
                            en: 'English',
                            hi: 'Hindi',
                            as: 'Assamese',
                            other: 'Other'
                          };
                          const languageLabel = item.language ? (languageMap[item.language] || item.language) : 'Unknown';
                          let bg = 'bg-emerald-100 text-emerald-800';
                          let title = 'Low risk';
                          if (risk >= 0.65) {
                            bg = 'bg-red-100 text-red-800';
                            title = `High bias risk (${(risk * 100).toFixed(0)}%) • ${languageLabel}`;
                          } else if (risk >= 0.35) {
                            bg = 'bg-amber-100 text-amber-800';
                            title = `Moderate bias risk (${(risk * 100).toFixed(0)}%) • ${languageLabel}`;
                          } else {
                            title = `Low bias risk (${(risk * 100).toFixed(0)}%) • ${languageLabel}`;
                          }
                          return (
                            <span
                              key={index}
                              title={title}
                              className={`px-2 py-0.5 rounded text-sm font-medium cursor-default transition-all hover:scale-105 ${bg}`}
                            >
                              {item.word}
                            </span>
                          );
                        })
                      : <p className="text-gray-700 italic">&quot;{auditData.transcript}&quot;</p>
                    }
                  </div>
                  {auditData.word_risks && auditData.word_risks.length > 0 && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Bias Risk</span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-700">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 inline-block border border-emerald-200" />
                        Low
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-amber-700">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 inline-block border border-amber-200" />
                        Moderate
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-red-700">
                        <span className="w-2.5 h-2.5 rounded-sm bg-red-100 inline-block border border-red-200" />
                        High
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t pt-4 flex flex-col gap-4">

                {/* Score Ring + Header */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle
                        cx="40" cy="40" r="30"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="40" cy="40" r="30"
                        fill="none"
                        stroke={
                          auditData.equity_score >= 0.7
                            ? '#0d9488'
                            : auditData.equity_score >= 0.4
                            ? '#f59e0b'
                            : '#ef4444'
                        }
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 30}`}
                        strokeDashoffset={`${2 * Math.PI * 30 * (1 - Number(auditData.equity_score))}`}
                        style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                      <span className="text-lg font-semibold text-gray-800 leading-none">
                        {(Number(auditData.equity_score) * 100).toFixed(0)}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-none mt-0.5">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Fairness Scorecard
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {auditData.equity_score >= 0.7
                        ? 'This speaker would be treated equitably by standard AI systems.'
                        : auditData.equity_score >= 0.4
                        ? 'Moderate bias risk detected. Correction recommended.'
                        : 'High bias risk. Standard AI would likely misrepresent this speaker.'}
                    </p>
                  </div>
                </div>

                {/* Scorecard Breakdown Table */}
                {auditData.scorecard && (
                  <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Breakdown</p>
                    </div>
                    {[
                      { label: 'Phonetic Accuracy', key: 'phonetic_accuracy', icon: '🔊' },
                      { label: 'Lexical Fairness', key: 'lexical_fairness', icon: '📝' },
                      { label: 'Contextual Equity', key: 'contextual_equity', icon: '🎯' },
                      { label: 'Overall Bias Risk', key: 'overall_bias_risk', icon: '⚠️', invert: true },
                    ].map(({ label, key, icon, invert }) => {
                      const raw = Number(auditData.scorecard[key] ?? 0);
                      const display = invert ? 1 - raw : raw;
                      const pct = Math.round(display * 100);
                      const barColor =
                        pct >= 70 ? 'bg-teal-400' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400';
                      return (
                        <div key={key} className="px-4 py-2.5 border-b border-slate-100 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600 flex items-center gap-1.5">
                              <span className="text-sm">{icon}</span>
                              {label}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor}`}
                              style={{
                                width: `${pct}%`,
                                transition: 'width 1s ease',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* XAI Explanation Box */}
                {auditData.xai_explanation && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex gap-3">
                    <ShieldCheck className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">
                        Why this score? (XAI)
                      </p>
                      <p className="text-sm text-teal-900 leading-relaxed">{auditData.xai_explanation}</p>
                    </div>
                  </div>
                )}

                {/* Existing Audit Details (accent, features, bias analysis) */}
                {typeof auditData.audit === 'object' && auditData.audit !== null && (
                  <div className="space-y-2">
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
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
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