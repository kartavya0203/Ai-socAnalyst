import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'

const RISK_META = {
  High: { icon: ShieldAlert, color: '#F87171', bg: 'rgba(239,68,68,0.1)', dot: '#EF4444' },
  Medium: { icon: AlertTriangle, color: '#FCD34D', bg: 'rgba(245,158,11,0.1)', dot: '#F59E0B' },
  Low: { icon: ShieldCheck, color: '#34D399', bg: 'rgba(16,185,129,0.1)', dot: '#10B981' },
}

const relTime = ts => {
  if (!ts) return ''
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

const feedMsg = a => {
  const pred = a.prediction === 'anomaly' ? 'Anomaly' : 'Normal traffic'
  if (a.risk === 'High') return `⚠ ${a.attack_type} — ${pred} from ${a.src_ip}`
  if (a.risk === 'Medium') return `${a.attack_type} flagged — ${pred}`
  return `${a.attack_type} observed from ${a.src_ip}`
}

export default function ThreatFeed({ alerts }) {
  const feed = useMemo(() =>
    [...alerts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 12),
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
          <div className="label-xs mb-0.5">Real-time</div>
          <div className="text-[15px] font-semibold text-slate-200">Live Threat Feed</div>
        </div>
        <motion.div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-400 tracking-wider">LIVE</span>
        </motion.div>
      </div>

      <div className="space-y-0 overflow-y-auto" style={{ maxHeight: 360 }}>
        {feed.length === 0 && <div className="py-8 text-center text-slate-600 text-[13px]">No events yet</div>}
        {feed.map((a, i) => {
          const meta = RISK_META[a.risk] || RISK_META.Low
          const Icon = meta.icon
          const isAnom = a.prediction === 'anomaly'
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.035 }}
              className="flex items-start gap-3 py-3 cursor-default"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                style={{ background: meta.bg }}>
                <Icon size={13} style={{ color: meta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-slate-300 leading-snug">{feedMsg(a)}</div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="mono text-[10px] text-slate-600">{a.dst_ip}</span>
                  {isAnom && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(249,115,22,0.1)', color: '#FB923C' }}>
                      {a.confidence}% conf.
                    </span>
                  )}
                  <span className="text-[10px] text-slate-600 truncate max-w-[100px]">{a.action?.split(' ').slice(0, 3).join(' ')}</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-600 mono flex-shrink-0">{relTime(a.created_at)}</div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
