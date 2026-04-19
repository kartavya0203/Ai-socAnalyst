import { motion } from 'framer-motion'
import { Shield, Activity } from 'lucide-react'

export default function Hero({ alerts }) {
  const high = alerts.filter(a => a.risk === 'High').length
  const threatScore = alerts.length === 0 ? 0 : Math.min(100, Math.round((high / alerts.length) * 100 * 1.4 + (alerts.length > 5 ? 15 : 0)))
  const scoreColor = threatScore >= 60 ? '#F87171' : threatScore >= 35 ? '#FCD34D' : '#34D399'
  const scoreLabel = threatScore >= 60 ? 'Critical' : threatScore >= 35 ? 'Elevated' : 'Normal'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl mb-6"
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #111827 50%, #0F1E35 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        minHeight: 140,
      }}
    >
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: -60, left: -40, width: 280, height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, right: 80, width: 200, height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Dot grid overlay */}
      <div className="dot-grid absolute inset-0 opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-6 p-6 sm:p-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Shield size={13} className="text-blue-400" />
            </div>
            <span className="text-[11px] font-medium text-blue-400" style={{ letterSpacing: '.08em' }}>
              SECURITY OPERATIONS CENTER
            </span>
          </div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-white leading-tight tracking-tight mb-2">
            Security Operations Overview
          </h1>
          <p className="text-[13px] text-slate-400 max-w-lg leading-relaxed">
            Real-time autonomous threat detection and AI-powered incident response.
            Monitoring <span className="text-slate-300 font-medium">{alerts.length}</span> active security events.
          </p>
        </div>

        {/* Threat Score Gauge */}
        <div className="shrink-0 flex flex-col items-center hidden sm:flex">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42 * threatScore / 100} ${2 * Math.PI * 42}`}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${scoreColor})`, transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <div className="text-[20px] font-bold leading-none" style={{ color: scoreColor }}>{threatScore}</div>
              <div className="text-[9px] text-slate-500 mt-0.5 font-medium" style={{ letterSpacing: '.06em' }}>SCORE</div>
            </div>
          </div>
          <div className="text-[11px] font-semibold mt-1" style={{ color: scoreColor }}>{scoreLabel}</div>
          <div className="label-xs mt-0.5">Threat Level</div>
        </div>
      </div>
    </motion.div>
  )
}
