import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px' }}>
      <div className="text-[11px] text-slate-400 mb-1">{label}</div>
      <div className="text-[13px] font-semibold text-blue-400">{payload[0].value} alerts</div>
    </div>
  )
}

export default function ThreatTimeline({ alerts }) {
  const data = useMemo(() => {
    const buckets = {}
    alerts.forEach(a => {
      if (!a.created_at) return
      const d = new Date(a.created_at)
      const key = `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
      buckets[key] = (buckets[key] || 0) + 1
    })
    return Object.entries(buckets).sort(([a],[b]) => a.localeCompare(b)).map(([time, count]) => ({ time, count }))
  }, [alerts])

  if (!data.length) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5 flex items-center justify-center" style={{ minHeight: 220 }}>
      <div className="text-center text-slate-600">
        <div className="text-3xl mb-2">—</div>
        <div className="label-xs">No timeline data</div>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="label-xs mb-1">Event Timeline</div>
      <div className="text-[15px] font-semibold text-slate-200 mb-4">Threat Activity Over Time</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569', fontFamily: 'JetBrains Mono' }} />
            <YAxis tick={{ fontSize: 10, fill: '#475569', fontFamily: 'JetBrains Mono' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2}
              fill="url(#tg1)"
              dot={{ fill: '#3B82F6', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#60A5FA', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
