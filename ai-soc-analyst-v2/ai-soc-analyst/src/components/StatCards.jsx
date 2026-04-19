import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldAlert, AlertTriangle, ShieldCheck, Brain, TrendingUp } from 'lucide-react'
import { SparklineChart } from './MiniCharts'

function makeSpark(base, len = 8) {
  const safe = base > 0 ? base : 1
  const out = []
  for (let i = 0; i < len; i++) {
    out.push({ v: Math.max(0, safe + Math.round((Math.random() - 0.45) * safe * 0.65)) })
  }
  return out
}

function StatCard({ icon: Icon, label, value, sub, color, glowColor, trend, trendUp, sparkData, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="card p-5 cursor-default relative overflow-hidden"
      style={{ boxShadow: `0 0 0 1px ${glowColor}12` }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}35, 0 8px 32px ${glowColor}14` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${glowColor}12` }}
    >
      {/* Subtle top gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${glowColor}35,transparent)` }} />

      <div className="flex items-start justify-between mb-3.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${glowColor}14`, border: `1px solid ${glowColor}28` }}>
          <Icon size={17} style={{ color }} />
        </div>
        {trend != null && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
            {trendUp ? '↑' : '↓'} {trend}%
          </span>
        )}
      </div>

      <motion.div
        className="text-[30px] font-bold leading-none tracking-tight mb-0.5"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</div>
      {sub && <div className="text-[11px] text-slate-600 mb-3">{sub}</div>}

      {sparkData && (
        <div className="h-9 -mx-1 mt-2">
          <SparklineChart data={sparkData} color={color} />
        </div>
      )}
    </motion.div>
  )
}

export default function StatCards({ alerts }) {
  const stats = useMemo(() => {
    const total = alerts.length
    const high = alerts.filter(a => a.risk === 'High').length
    const med = alerts.filter(a => a.risk === 'Medium').length
    const low = alerts.filter(a => a.risk === 'Low').length
    const anomalies = alerts.filter(a => a.prediction === 'anomaly').length
    const avgConf = total
      ? Math.round(alerts.reduce((s, a) => s + (Number(a.confidence) || 0), 0) / total)
      : 0
    const score = total === 0 ? 0 : Math.min(99, Math.round((high / total) * 72 + (anomalies / total) * 22 + (total > 3 ? 6 : 2)))
    return { total, high, med, low, anomalies, avgConf, score }
  }, [alerts])

  const cards = [
    {
      icon: Activity,
      label: 'Total Alerts',
      value: stats.total,
      sub: `${stats.anomalies} anomalies`,
      color: '#60A5FA', glowColor: '#3B82F6',
      trend: 12, trendUp: true,
      sparkData: makeSpark(stats.total),
    },
    {
      icon: ShieldAlert,
      label: 'High Risk',
      value: stats.high,
      sub: stats.total ? `${Math.round((stats.high / stats.total) * 100)}% of total` : '0%',
      color: '#F87171', glowColor: '#EF4444',
      trend: 8, trendUp: true,
      sparkData: makeSpark(stats.high),
    },
    {
      icon: AlertTriangle,
      label: 'Medium Risk',
      value: stats.med,
      sub: stats.total ? `${Math.round((stats.med / stats.total) * 100)}% of total` : '0%',
      color: '#FCD34D', glowColor: '#F59E0B',
      trend: 3, trendUp: false,
      sparkData: makeSpark(stats.med),
    },
    {
      icon: ShieldCheck,
      label: 'Low Risk',
      value: stats.low,
      sub: 'Routine traffic',
      color: '#34D399', glowColor: '#10B981',
      trend: null, trendUp: false,
      sparkData: makeSpark(stats.low),
    },
    {
      icon: Brain,
      label: 'Avg Confidence',
      value: `${stats.avgConf}%`,
      sub: 'ML model confidence',
      color: '#A78BFA', glowColor: '#8B5CF6',
      trend: null, trendUp: false,
      sparkData: makeSpark(stats.avgConf),
    },
    {
      icon: TrendingUp,
      label: 'Threat Score',
      value: stats.score,
      sub: stats.score >= 60 ? 'Critical' : stats.score >= 35 ? 'Elevated' : 'Normal',
      color: stats.score >= 60 ? '#F87171' : stats.score >= 35 ? '#FCD34D' : '#34D399',
      glowColor: stats.score >= 60 ? '#EF4444' : stats.score >= 35 ? '#F59E0B' : '#10B981',
      trend: 5, trendUp: true,
      sparkData: makeSpark(stats.score, 10),
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-5">
      {cards.map((c, i) => <StatCard key={c.label} {...c} delay={i * 0.06} />)}
    </div>
  )
}
