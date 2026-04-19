import { useState, useEffect } from 'react'
import { Search, Bell, RefreshCw, ChevronDown, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar({ alertCount, refreshing, onRefresh }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fmtTime = d => d.toLocaleTimeString('en-US', { hour12: false })
  const fmtDate = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <header
      className="flex items-center gap-3 px-5 h-[60px] shrink-0 z-40"
      style={{
        background: 'rgba(11,18,32,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-2.5 mr-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
          <Shield size={14} className="text-white" />
        </div>
        <span className="text-[14px] font-bold text-white tracking-tight whitespace-nowrap hidden sm:block">AI SOC Analyst</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-white/10 hidden sm:block" />

      {/* Search */}
      <div className="relative flex-1 max-w-xs hidden md:block">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          className="input-base w-full pl-8 pr-3 py-1.5 text-[12px]"
          placeholder="Search IPs, attack types, alerts…"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Live status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[11px] font-semibold text-emerald-400" style={{ letterSpacing: '.06em' }}>LIVE</span>
          <span className="text-[11px] text-slate-500">{alertCount} events</span>
        </div>

        {/* Refresh */}
        <motion.button
          onClick={onRefresh}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <motion.div animate={{ rotate: refreshing ? 360 : 0 }} transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0, ease: 'linear' }}>
            <RefreshCw size={13} className="text-slate-400" />
          </motion.div>
        </motion.button>

        {/* Bell */}
        <motion.button
          className="relative w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <Bell size={14} className="text-slate-400" />
          <motion.span
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-[#0B1220]"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 hidden md:block" />

        {/* Clock */}
        <div className="text-right hidden md:block">
          <div className="mono text-[12px] font-medium text-slate-300">{fmtTime(time)}</div>
          <div className="text-[9px] text-slate-600 leading-tight">{fmtDate(time)}</div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer rounded-xl px-2 py-1 hover:bg-white/5 transition-colors">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-300 flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.18)', border: '1px solid rgba(59,130,246,0.28)' }}>
            KV
          </div>
          <ChevronDown size={11} className="text-slate-600 hidden sm:block" />
        </div>
      </div>
    </header>
  )
}
