import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = {
  High:   { fill: '#EF4444', glow: 'rgba(239,68,68,0.4)',   light: 'rgba(239,68,68,0.12)'  },
  Medium: { fill: '#F59E0B', glow: 'rgba(245,158,11,0.4)',  light: 'rgba(245,158,11,0.12)' },
  Low:    { fill: '#10B981', glow: 'rgba(16,185,129,0.4)',  light: 'rgba(16,185,129,0.12)' },
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px' }}>
      <div className="text-[12px] font-semibold" style={{ color: COLORS[name]?.fill }}>{name} Risk</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{value} alerts</div>
    </div>
  )
}

export default function RiskChart({ alerts }) {
  const data = useMemo(() => {
    const c = { High: 0, Medium: 0, Low: 0 }
    alerts.forEach(a => { if (c[a.risk] !== undefined) c[a.risk]++ })
    return Object.entries(c).map(([name, value]) => ({ name, value })).filter(d => d.value > 0)
  }, [alerts])

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="label-xs mb-1">Risk Distribution</div>
      <div className="text-[15px] font-semibold text-slate-200 mb-4">Threat Severity Breakdown</div>

      <div className="relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
              paddingAngle={3} dataKey="value" strokeWidth={0} isAnimationActive>
              {data.map(entry => (
                <Cell key={entry.name} fill={COLORS[entry.name]?.fill}
                  style={{ filter: `drop-shadow(0 0 6px ${COLORS[entry.name]?.glow})`, cursor: 'default' }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[24px] font-bold text-white">{total}</div>
          <div className="label-xs">EVENTS</div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[d.name]?.fill, boxShadow: `0 0 5px ${COLORS[d.name]?.fill}` }} />
              <span className="text-[12px] text-slate-400">{d.name} Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[11px] font-semibold" style={{ color: COLORS[d.name]?.fill }}>{d.value}</div>
              <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${total ? (d.value/total)*100 : 0}%`, background: COLORS[d.name]?.fill }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
