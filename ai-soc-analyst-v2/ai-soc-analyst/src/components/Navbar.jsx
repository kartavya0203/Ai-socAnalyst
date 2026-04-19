import { useState, useEffect } from 'react'
import { Search, Bell, RefreshCw, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar({ alertCount, refreshing, onRefresh }) {
  const [time, setTime] = useState(new Date())
  const [notifOpen, setNotifOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmt = d => d.toLocaleTimeString('en-US', { hour12: false })
  const fmtDate = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header
      className="flex items-center gap-4 px-6 h-16 shrink-0"
      style={{
        background: 'rgba(11,15,25,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 40,
      }}
    >
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          className="input-base w-full pl-9 pr-4 py-2 text-[13px]"
          placeholder="Search threats, IPs, alerts..."
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Live status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="live-dot" />
          <span className="text-[11px] font-semibold text-emerald-400" style={{ letterSpacing: '.06em' }}>LIVE</span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">{alertCount} events</span>
        </div>

        {/* Refresh */}
        <motion.button
          onClick={onRefresh}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}>
            <RefreshCw size={14} className="text-slate-400" />
          </motion.div>
        </motion.button>

        {/* Bell */}
        <div className="relative">
          <motion.button
            onClick={() => setNotifOpen(o => !o)}
            className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={15} className="text-slate-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"
              style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }} />
          </motion.button>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }} />

        {/* Clock */}
        <div className="text-right hidden md:block">
          <div className="mono text-[13px] font-medium text-slate-300">{fmt(time)}</div>
          <div className="text-[10px] text-slate-600">{fmtDate(time)}</div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer rounded-xl px-2 py-1.5 transition-colors hover:bg-white/5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-blue-300"
            style={{ background: 'rgba(59,130,246,0.18)', border: '1px solid rgba(59,130,246,0.25)' }}>
            KV
          </div>
          <ChevronDown size={12} className="text-slate-600" />
        </div>
      </div>
    </header>
  )
}
