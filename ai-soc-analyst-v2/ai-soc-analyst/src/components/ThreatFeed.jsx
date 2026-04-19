import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'

const RISK_META = {
  High:   { icon: ShieldAlert,   color: '#F87171', bg: 'rgba(239,68,68,0.1)',   dot: '#EF4444' },
  Medium: { icon: AlertTriangle, color: '#FCD34D', bg: 'rgba(245,158,11,0.1)',  dot: '#F59E0B' },
  Low:    { icon: ShieldCheck,   color: '#34D399', bg: 'rgba(16,185,129,0.1)',  dot: '#10B981' },
}

const relTime = ts => {
  if (!ts) return ''
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  return `${Math.floor(diff/3600)}h ago`
}

const feedMsg = a => {
  if (a.risk === 'High') return `Critical: ${a.attack_type} detected from ${a.src_ip}`
  if (a.risk === 'Medium') return `Warning: ${a.attack_type} activity from ${a.src_ip}`
  return `Info: ${a.attack_type} observed — ${a.src_ip}`
}

export default function ThreatFeed({ alerts }) {
  const feed = useMemo(() =>
    [...alerts]
      .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10),
    [alerts]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="label-xs mb-0.5">Live Activity</div>
          <div className="text-[15px] font-semibold text-slate-200">Threat Feed</div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="live-dot" style={{ width: 6, height: 6 }} />
          <span className="text-[10px] font-semibold text-emerald-400" style={{ letterSpacing: '.08em' }}>LIVE</span>
        </div>
      </div>

      <div className="space-y-0 overflow-y-auto" style={{ maxHeight: 380 }}>
        {feed.length === 0 && (
          <div className="py-8 text-center text-slate-600 text-[13px]">No events yet</div>
        )}
        {feed.map((a, i) => {
          const meta = RISK_META[a.risk] || RISK_META.Low
          const Icon = meta.icon
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="feed-entry flex items-start gap-3 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="mt-0.5 w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: meta.bg }}>
                <Icon size={13} style={{ color: meta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-slate-300 leading-snug">{feedMsg(a)}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-600 mono">{a.dst_ip}</span>
                  <span className="text-[10px]" style={{ color: meta.color }}>
                    {a.action?.split(' ').slice(0,4).join(' ')}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 flex-shrink-0 mono">{relTime(a.created_at)}</div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
