import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#3B82F6','#EF4444','#F59E0B','#10B981','#8B5CF6','#F97316','#06B6D4']

export default function AttackTypeChart({ alerts }) {
  const data = useMemo(() => {
    const c = {}
    alerts.forEach(a => { if (a.attack_type) c[a.attack_type] = (c[a.attack_type]||0)+1 })
    return Object.entries(c).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0,7)
  }, [alerts])

  const max = data[0]?.count || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="label-xs mb-1">Attack Vectors</div>
      <div className="text-[15px] font-semibold text-slate-200 mb-5">Top Attack Types</div>
      <div className="space-y-3.5">
        {data.map((d, i) => (
          <div key={d.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-slate-400 truncate max-w-[70%]" title={d.name}>{d.name}</span>
              <span className="text-[12px] font-semibold mono" style={{ color: COLORS[i % COLORS.length] }}>{d.count}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: COLORS[i % COLORS.length], boxShadow: `0 0 6px ${COLORS[i%COLORS.length]}66` }}
                initial={{ width: 0 }}
                animate={{ width: `${(d.count / max) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.4,0,0.2,1] }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && <div className="text-slate-600 text-[13px] py-4 text-center">No attack data</div>}
      </div>
    </motion.div>
  )
}
