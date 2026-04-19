import { useMemo } from 'react'
import { motion } from 'framer-motion'

const BAR_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6', '#F97316', '#06B6D4', '#EC4899']

export default function AttackTypeChart({ alerts }) {
  const data = useMemo(() => {
    const c = {}
    alerts.forEach(a => { if (a.attack_type) c[a.attack_type] = (c[a.attack_type] || 0) + 1 })
    return Object.entries(c).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)
  }, [alerts])

  const max = data[0]?.count || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="label-xs mb-0.5">Attack Vectors</div>
      <div className="text-[15px] font-semibold text-slate-200 mb-5">Top Attack Types</div>

      {data.length === 0
        ? <div className="py-8 text-center text-slate-600 text-[13px]">No data</div>
        : <div className="space-y-3">
          {data.map((d, i) => (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-slate-400 truncate max-w-[72%]" title={d.name}>{d.name}</span>
                <span className="mono text-[12px] font-semibold" style={{ color: BAR_COLORS[i % BAR_COLORS.length] }}>{d.count}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: BAR_COLORS[i % BAR_COLORS.length], boxShadow: `0 0 5px ${BAR_COLORS[i % BAR_COLORS.length]}55` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(d.count / max) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      }
    </motion.div>
  )
}
