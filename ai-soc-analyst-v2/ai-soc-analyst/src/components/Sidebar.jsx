import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShieldAlert, Bell, BarChart3,
  Zap, Settings, ChevronLeft, ChevronRight,
  Shield, LogOut, User
} from 'lucide-react'

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',         id: 'dashboard' },
  { icon: ShieldAlert,     label: 'Threat Monitoring', id: 'threats' },
  { icon: Bell,            label: 'Alerts',            id: 'alerts' },
  { icon: BarChart3,       label: 'Analytics',         id: 'analytics' },
  { icon: Zap,             label: 'Response Center',   id: 'response' },
  { icon: Settings,        label: 'Settings',          id: 'settings' },
]

export default function Sidebar({ active, onNav }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen shrink-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D1220 0%, #0B0F19 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ minHeight: 64 }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
          <Shield size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="text-[13px] font-bold text-white leading-tight whitespace-nowrap tracking-tight">AI SOC Analyst</div>
              <div className="text-[10px] text-blue-400 font-medium whitespace-nowrap" style={{ letterSpacing: '.04em' }}>Enterprise Security</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 16px 12px' }} />

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="label-xs px-3 py-2"
            >Main Menu</motion.div>
          )}
        </AnimatePresence>

        {NAV.map((item, i) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <motion.div
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              whileHover={{ x: collapsed ? 0 : 2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Icon size={17} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="active-dot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                />
              )}
            </motion.div>
          )
        })}
      </nav>

      {/* User profile */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 8px' }}>
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-blue-300"
            style={{ background: 'rgba(59,130,246,0.18)', border: '1px solid rgba(59,130,246,0.25)' }}>
            KV
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <div className="text-[12px] font-medium text-slate-300 truncate">Kartavya V.</div>
                <div className="text-[10px] text-slate-500 truncate">SOC Analyst</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && <LogOut size={14} className="text-slate-600 flex-shrink-0" />}
        </div>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center z-50"
        style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {collapsed
          ? <ChevronRight size={12} className="text-slate-400" />
          : <ChevronLeft size={12} className="text-slate-400" />
        }
      </motion.button>
    </motion.aside>
  )
}
