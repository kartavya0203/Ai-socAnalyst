import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, Globe, TrendingUp, Crosshair, Layers, Brain } from 'lucide-react'

export default function IntelligencePanel({ alerts }) {
  const intel = useMemo(() => {
    if (!alerts.length) return null
    const attackCounts = {}
    alerts.forEach(a => { if (a.attack_type) attackCounts[a.attack_type] = (attackCounts[a.attack_type]||0)+1 })
    const topAttack = Object.entries(attackCounts).sort((a,b)=>b[1]-a[1])[0]

    const dstCounts = {}
    alerts.forEach(a => { if (a.dst_ip) dstCounts[a.dst_ip] = (dstCounts[a.dst_ip]||0)+1 })
    const topDst = Object.entries(dstCounts).sort((a,b)=>b[1]-a[1])[0]

    const srcCounts = {}
    alerts.forEach(a => { if (a.src_ip) srcCounts[a.src_ip] = (srcCounts[a.src_ip]||0)+1 })
    const topSrc = Object.entries(srcCounts).sort((a,b)=>b[1]-a[1])[0]

    const protoCounts = {}
    alerts.forEach(a => { if (a.protocol) protoCounts[a.protocol] = (protoCounts[a.protocol]||0)+1 })
    const topProto = Object.entries(protoCounts).sort((a,b)=>b[1]-a[1])[0]

    const high = alerts.filter(a=>a.risk==='High').length
    const pct = alerts.length ? Math.round((high/alerts.length)*100) : 0
    const score = Math.min(99, Math.round(pct*1.3 + (alerts.length > 3 ? 12 : 4)))
    const scoreLabel = score >= 60 ? 'CRITICAL' : score >= 35 ? 'ELEVATED' : 'NORMAL'
    const scoreColor = score >= 60 ? '#F87171' : score >= 35 ? '#FCD34D' : '#34D399'
    const focus = score >= 60 ? 'Immediate DDoS containment' : score >= 35 ? 'Monitor scanning activity' : 'Routine surveillance'

    return { topAttack, topDst, topSrc, topProto, score, scoreLabel, scoreColor, focus }
  }, [alerts])

  if (!intel) return null

  const rows = [
    { icon: Target,    label: 'Most Targeted Host',    value: intel.topDst?.[0],      sub: `${intel.topDst?.[1]} hits`,         color: '#FCD34D' },
    { icon: Layers,    label: 'Top Protocol',           value: intel.topProto?.[0],    sub: `${intel.topProto?.[1]} packets`,     color: '#60A5FA' },
    { icon: Crosshair, label: 'Top Attacker IP',        value: intel.topSrc?.[0],      sub: `${intel.topSrc?.[1]} events`,        color: '#F87171' },
    { icon: TrendingUp,label: 'Common Attack Vector',   value: intel.topAttack?.[0],   sub: `${intel.topAttack?.[1]} occurrences`,color: '#A78BFA' },
    { icon: Brain,     label: 'SOC Focus',              value: intel.focus,            sub: 'AI recommendation',                  color: '#34D399' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="flex flex-col gap-4"
    >
      {/* Score card */}
      <div className="card p-5">
        <div className="label-xs mb-3">Network Risk Score</div>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="32" cy="32" r="26" fill="none" stroke={intel.scoreColor} strokeWidth="6"
                strokeDasharray={`${2*Math.PI*26*intel.score/100} ${2*Math.PI*26}`}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${intel.scoreColor})`, transition: 'stroke-dasharray .8s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[15px] font-bold" style={{ color: intel.scoreColor }}>{intel.score}</span>
            </div>
          </div>
          <div>
            <div className="text-[18px] font-bold leading-tight" style={{ color: intel.scoreColor }}>{intel.scoreLabel}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Threat Level</div>
          </div>
        </div>
      </div>

      {/* Intel rows */}
      <div className="card p-5">
        <div className="label-xs mb-3">Threat Intelligence</div>
        <div className="space-y-3">
          {rows.map((r, i) => {
            const Icon = r.icon
            return (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/[0.02] cursor-default"
                style={{ border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${r.color}14`, border: `1px solid ${r.color}25` }}>
                  <Icon size={14} style={{ color: r.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="label-xs mb-0.5">{r.label}</div>
                  <div className="text-[12px] font-semibold truncate" style={{ color: r.color }} title={r.value}>{r.value || '—'}</div>
                  <div className="text-[10px] text-slate-600">{r.sub}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
