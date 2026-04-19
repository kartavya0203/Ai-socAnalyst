import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, Globe, TrendingUp, Crosshair, Layers, Brain, Cpu } from 'lucide-react'

export default function IntelligencePanel({ alerts }) {
  const intel = useMemo(() => {
    if (!alerts.length) return null

    const count = (arr, key) => {
      const c = {}
      arr.forEach(a => { if (a[key]) c[a[key]] = (c[a[key]] || 0) + 1 })
      return Object.entries(c).sort((a, b) => b[1] - a[1])
    }

    const topAttack = count(alerts, 'attack_type')[0]
    const topSrc = count(alerts, 'src_ip')[0]
    const topDst = count(alerts, 'dst_ip')[0]
    const topProto = count(alerts, 'protocol')[0]
    const protoDist = count(alerts, 'protocol')

    const anomalies = alerts.filter(a => a.prediction === 'anomaly')
    const highConf = [...anomalies].sort((a, b) => Number(b.confidence || 0) - Number(a.confidence || 0))[0]
    const avgConf = anomalies.length
      ? Math.round(anomalies.reduce((s, a) => s + Number(a.confidence || 0), 0) / anomalies.length)
      : 0

    const high = alerts.filter(a => a.risk === 'High').length
    const score = Math.min(99, Math.round((high / alerts.length) * 70 + (anomalies.length / alerts.length) * 25 + (alerts.length > 3 ? 6 : 2)))
    const scoreColor = score >= 60 ? '#F87171' : score >= 35 ? '#FCD34D' : '#34D399'
    const scoreLabel = score >= 60 ? 'CRITICAL' : score >= 35 ? 'ELEVATED' : 'NORMAL'

    return { topAttack, topSrc, topDst, topProto, protoDist, highConf, avgConf, score, scoreColor, scoreLabel }
  }, [alerts])

  if (!intel) return null

  const infoRows = [
    { icon: TrendingUp, label: 'Top Attack Vector', value: intel.topAttack?.[0], sub: `${intel.topAttack?.[1]} occurrences`, color: '#60A5FA' },
    { icon: Crosshair, label: 'Most Active Attacker', value: intel.topSrc?.[0], sub: `${intel.topSrc?.[1]} events`, color: '#F87171' },
    { icon: Target, label: 'Most Targeted Host', value: intel.topDst?.[0], sub: `Hit ${intel.topDst?.[1]} times`, color: '#FCD34D' },
    { icon: Layers, label: 'Dominant Protocol', value: intel.topProto?.[0], sub: `${intel.topProto?.[1]} connections`, color: '#A78BFA' },
    { icon: Brain, label: 'Highest Confidence', value: intel.highConf ? `${intel.highConf.confidence}%` : '—', sub: intel.highConf?.attack_type || 'No anomalies', color: '#FB923C' },
    { icon: Cpu, label: 'Avg Anomaly Confidence', value: `${intel.avgConf}%`, sub: 'Across all anomalies', color: '#34D399' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="label-xs mb-0.5">AI Analysis Engine</div>
      <div className="text-[15px] font-semibold text-slate-200 mb-4">Threat Intelligence</div>

      {/* Network Risk Score */}
      <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
        style={{ background: `${intel.scoreColor}0d`, border: `1px solid ${intel.scoreColor}22` }}>
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <motion.circle
              cx="24" cy="24" r="19" fill="none" stroke={intel.scoreColor} strokeWidth="5" strokeLinecap="round"
              initial={{ strokeDasharray: '0 119.4' }}
              animate={{ strokeDasharray: `${1.194 * intel.score} 119.4` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 4px ${intel.scoreColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[12px] font-bold" style={{ color: intel.scoreColor }}>{intel.score}</span>
          </div>
        </div>
        <div>
          <div className="text-[16px] font-bold leading-tight" style={{ color: intel.scoreColor }}>{intel.scoreLabel}</div>
          <div className="text-[11px] text-slate-500">Current Network Risk Level</div>
        </div>
      </div>

      {/* Protocol distribution mini bars */}
      <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="label-xs mb-2">Protocol Distribution</div>
        <div className="space-y-1.5">
          {intel.protoDist.slice(0, 4).map(([proto, count], i) => {
            const maxCount = intel.protoDist[0]?.[1] || 1
            const colors = ['#60A5FA', '#A78BFA', '#FCD34D', '#34D399']
            return (
              <div key={proto} className="flex items-center gap-2">
                <span className="mono text-[10px] text-slate-500 w-10 flex-shrink-0">{proto}</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: colors[i] }}
                    initial={{ width: 0 }} animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }} />
                </div>
                <span className="mono text-[10px] text-slate-600 w-4">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Intel rows */}
      <div className="space-y-2">
        {infoRows.map((r, i) => {
          const Icon = r.icon
          return (
            <motion.div key={r.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/[0.025] cursor-default"
              style={{ border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: `${r.color}12`, border: `1px solid ${r.color}22` }}>
                <Icon size={13} style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="label-xs mb-0">{r.label}</div>
                <div className="text-[12px] font-semibold truncate" style={{ color: r.color }} title={r.value}>{r.value || '—'}</div>
              </div>
              <div className="text-[10px] text-slate-600 text-right flex-shrink-0 max-w-[80px] truncate">{r.sub}</div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
