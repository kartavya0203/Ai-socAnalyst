import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, Activity, Cpu } from 'lucide-react'

export default function Hero({ alerts }) {
  const stats = useMemo(() => {
    const total = alerts.length
    const anomalies = alerts.filter(a => a.prediction === 'anomaly').length
    const high = alerts.filter(a => a.risk === 'High').length
    const avgConf = total
      ? Math.round(alerts.reduce((s, a) => s + (Number(a.confidence) || 0), 0) / total)
      : 0
    const score = total === 0 ? 0 : Math.min(99, Math.round((high / total) * 70 + (anomalies / total) * 25 + (total > 5 ? 8 : 2)))
    const scoreLabel = score >= 60 ? 'Critical' : score >= 35 ? 'Elevated' : 'Normal'
    const scoreColor = score >= 60 ? '#F87171' : score >= 35 ? '#FCD34D' : '#34D399'
    return { total, anomalies, high, avgConf, score, scoreLabel, scoreColor }
  }, [alerts])

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl mb-5"
      style={{
        background: 'linear-gradient(135deg, #0D1628 0%, #111827 60%, #0F1E38 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: -80, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, right: 60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-25 pointer-events-none" />

      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(16,185,129,0.3), transparent)' }} />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-6 py-6">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)' }}>
              <Cpu size={11} className="text-blue-400" />
              <span className="text-[10px] font-semibold text-blue-400" style={{ letterSpacing: '.08em' }}>AUTONOMOUS AI ENGINE</span>
            </div>
            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-semibold text-emerald-400" style={{ letterSpacing: '.06em' }}>MONITORING</span>
            </motion.div>
          </div>

          <h1 className="text-[22px] sm:text-[26px] font-bold text-white leading-tight tracking-tight mb-2">
            Security Operations Overview
          </h1>
          <p className="text-[13px] text-slate-400 leading-relaxed max-w-xl">
            Autonomous AI-powered threat monitoring and response. Analyzing{' '}
            <span className="text-slate-200 font-medium">{stats.total}</span> events with{' '}
            <span className="text-blue-400 font-medium">{stats.anomalies}</span> anomalies detected.
          </p>

          {/* Quick stats strip */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {[
              { label: 'Anomalies', value: stats.anomalies, color: '#F87171' },
              { label: 'Avg Confidence', value: `${stats.avgConf}%`, color: '#A78BFA' },
              { label: 'High Risk', value: stats.high, color: '#FCD34D' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[12px] text-slate-500">{s.label}</span>
                <span className="text-[12px] font-semibold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Score Gauge */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-[90px] h-[90px]">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
              <motion.circle
                cx="50" cy="50" r="40" fill="none" stroke={stats.scoreColor} strokeWidth="7"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 251.2' }}
                animate={{ strokeDasharray: `${2.512 * stats.score} 251.2` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 6px ${stats.scoreColor})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-bold leading-none" style={{ color: stats.scoreColor }}>{stats.score}</span>
              <span className="text-[8px] text-slate-500 mt-0.5 font-medium tracking-widest">SCORE</span>
            </div>
          </div>
          <div className="text-[12px] font-semibold mt-1.5" style={{ color: stats.scoreColor }}>{stats.scoreLabel}</div>
          <div className="text-[10px] text-slate-600">Threat Level</div>
        </div>
      </div>
    </motion.div>
  )
}
