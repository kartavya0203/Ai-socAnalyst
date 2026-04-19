import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldAlert, AlertTriangle, ShieldCheck, TrendingUp, Mail } from 'lucide-react'
import { SparklineChart } from './MiniCharts'

function StatCard({ icon: Icon, label, value, color, glowColor, trend, trendUp, sparkData, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.4,0,0.2,1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="card p-5 cursor-default group"
      style={{ boxShadow: `0 0 0 1px ${glowColor}15, 0 4px 24px ${glowColor}0a` }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}40, 0 8px 32px ${glowColor}18` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}15, 0 4px 24px ${glowColor}0a` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${glowColor}18`, border: `1px solid ${glowColor}30` }}>
          <Icon size={17} style={{ color }} />
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${trendUp ? 'text-red-400 bg-red-400/10' : 'text-emerald-400 bg-emerald-400/10'}`}>
            <span>{trendUp ? '↑' : '↓'}</span>
            <span>{trend}%</span>
          </div>
        )}
      </div>
      <motion.div
        className="text-[32px] font-bold leading-none tracking-tight mb-1"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.15 }}
      >
        {value}
      </motion.div>
      <div className="label-xs mb-4">{label}</div>
      {sparkData && (
        <div className="h-10 -mx-1">
          <SparklineChart data={sparkData} color={color} />
        </div>
      )}
    </motion.div>
  )
}

function makeSpark(base, len = 8) {
  const safe = base > 0 ? base : 1
  const result = []
  for (let i = 0; i < len; i++) {
    result.push({ v: Math.max(0, safe + Math.round((Math.random() - 0.45) * safe * 0.6) + i * 0.3) })
  }
  return result
}

export default function StatCards({ alerts }) {
  const stats = useMemo(() => {
    const total = alerts.length
    const high = alerts.filter(a => a.risk === 'High').length
    const med = alerts.filter(a => a.risk === 'Medium').length
    const low = alerts.filter(a => a.risk === 'Low').length
    const score = total === 0 ? 0 : Math.min(99, Math.round((high / total) * 80 + (total > 3 ? 15 : 5)))
    const emails = high
    return { total, high, med, low, score, emails }
  }, [alerts])

  const CARDS = [
    { icon: Activity,      label: 'TOTAL ALERTS',       value: stats.total,  color: '#60A5FA', glowColor: '#3B82F6', trend: 12,   trendUp: true,  sparkData: makeSpark(stats.total) },
    { icon: ShieldAlert,   label: 'HIGH RISK',           value: stats.high,   color: '#F87171', glowColor: '#EF4444', trend: 8,    trendUp: true,  sparkData: makeSpark(stats.high) },
    { icon: AlertTriangle, label: 'MEDIUM RISK',         value: stats.med,    color: '#FCD34D', glowColor: '#F59E0B', trend: 3,    trendUp: false, sparkData: makeSpark(stats.med) },
    { icon: ShieldCheck,   label: 'LOW RISK',            value: stats.low,    color: '#34D399', glowColor: '#10B981', trend: null, trendUp: false, sparkData: makeSpark(stats.low) },
    { icon: TrendingUp,    label: 'ACTIVE THREAT SCORE', value: stats.score,  color: '#A78BFA', glowColor: '#8B5CF6', trend: 5,    trendUp: true,  sparkData: makeSpark(stats.score, 10) },
    { icon: Mail,          label: 'EMAILS SENT TODAY',   value: stats.emails, color: '#FB923C', glowColor: '#F97316', trend: null, trendUp: false, sparkData: makeSpark(stats.emails) },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {CARDS.map((c, i) => (
        <StatCard key={c.label} {...c} delay={i * 0.06} />
      ))}
    </div>
  )
}
