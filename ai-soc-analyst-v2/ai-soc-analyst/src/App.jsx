import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAlerts } from './api'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StatCards from './components/StatCards'
import RiskChart from './components/RiskChart'
import ThreatTimeline from './components/ThreatTimeline'
import AttackTypeChart from './components/AttackTypeChart'
import AlertsGrid from './components/AlertsGrid'
import ThreatFeed from './components/ThreatFeed'
import IntelligencePanel from './components/IntelligencePanel'
import { SkeletonCard, SkeletonChart, SkeletonTable } from './components/Skeletons'
import { WifiOff, RefreshCw, ShieldAlert } from 'lucide-react'

const REFRESH_MS = 5000

// ─── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#0B0F19' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo mark */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#3B82F6,#1D4ED8)', boxShadow: '0 0 40px rgba(59,130,246,0.4)' }}
            animate={{ boxShadow: ['0 0 30px rgba(59,130,246,0.3)', '0 0 60px rgba(59,130,246,0.6)', '0 0 30px rgba(59,130,246,0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ShieldAlert size={28} className="text-white" />
          </motion.div>
          {/* Orbit ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-500/30"
            style={{ margin: -10 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400"
              style={{ boxShadow: '0 0 8px #60A5FA' }} />
          </motion.div>
        </div>

        <div className="text-center">
          <div className="text-[18px] font-bold text-white mb-1">AI SOC Analyst</div>
          <div className="text-[12px] text-slate-500 tracking-widest uppercase">Initializing Security Engine</div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#3B82F6,#60A5FA)', boxShadow: '0 0 8px rgba(59,130,246,0.6)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </div>

        <div className="text-[11px] text-slate-600 tracking-widest">LOADING THREAT DATA...</div>
      </motion.div>
    </div>
  )
}

// ─── Error Screen ──────────────────────────────────────────────────────────────
function ErrorScreen({ message, onRetry }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: '#0B0F19' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4 rounded-2xl p-8 text-center"
        style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 40px rgba(239,68,68,0.08)' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <WifiOff size={24} className="text-red-400" />
        </div>

        <h2 className="text-[18px] font-bold text-white mb-1">Connection Failed</h2>
        <p className="text-[13px] text-slate-400 mb-2">Unable to reach the backend service</p>
        <p className="text-[11px] text-slate-600 mono mb-6">http://127.0.0.1:8000/alerts</p>

        <div className="text-left rounded-xl p-4 mb-6 space-y-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {['Ensure FastAPI backend is running on port 8000', 'Check that CORS is enabled on the server', 'Verify GET /alerts endpoint returns valid JSON'].map(tip => (
            <div key={tip} className="flex items-start gap-2 text-[12px] text-slate-500">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(239,68,68,0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <RefreshCw size={14} />
          Retry Connection
        </motion.button>
      </motion.div>
    </div>
  )
}

// ─── Skeleton Layout ───────────────────────────────────────────────────────────
function SkeletonLayout() {
  return (
    <div className="space-y-5">
      {/* Hero skeleton */}
      <div className="rounded-2xl overflow-hidden skeleton" style={{ height: 140 }} />
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonChart height={200} />
        <SkeletonChart height={200} />
        <SkeletonChart height={200} />
      </div>
      {/* Table */}
      <SkeletonTable />
    </div>
  )
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [alerts, setAlerts]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activePage, setActivePage] = useState('dashboard')

  const loadAlerts = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      const data = await fetchAlerts()

      console.log("API DATA:", data)

      setAlerts(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error("FETCH ERROR:", err)
      if (!silent) setError(err.message || 'Connection failed')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load
  useEffect(() => { loadAlerts(false) }, [loadAlerts])

  // Auto-refresh every 5s
  useEffect(() => {
    const t = setInterval(() => loadAlerts(true), REFRESH_MS)
    return () => clearInterval(t)
  }, [loadAlerts])

  // ── First-time loading ──
  if (loading) return <LoadingScreen />

  // ── Hard error (no cached data) ──
  if (error && alerts.length === 0) return <ErrorScreen message={error} onRetry={() => loadAlerts(false)} />

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0F19' }}>
      {/* Sidebar */}
      <Sidebar active={activePage} onNav={setActivePage} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          alertCount={alerts.length}
          refreshing={refreshing}
          onRefresh={() => loadAlerts(false)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#0B0F19' }}>
          <div className="p-5 lg:p-6 max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SkeletonLayout />
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* Hero */}
                  <Hero alerts={alerts} />

                  {/* KPI Cards */}
                  <StatCards alerts={alerts} />

                  {/* Charts row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <RiskChart alerts={alerts} />
                    <ThreatTimeline alerts={alerts} />
                    <AttackTypeChart alerts={alerts} />
                  </div>

                  {/* Main content + right panel */}
                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4 mb-4">
                    <AlertsGrid alerts={alerts} />

                    <div className="flex flex-col gap-4">
                      <ThreatFeed alerts={alerts} />
                    </div>
                  </div>

                  {/* Intelligence panel (full width on xl, or below on smaller) */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                    <div className="xl:col-span-1">
                      <IntelligencePanel alerts={alerts} />
                    </div>

                    {/* Heatmap-style hour activity grid */}
                    <div className="xl:col-span-2">
                      <HourHeatmap alerts={alerts} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between py-4 border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-[11px] text-slate-600">
                      AI SOC Analyst © 2026 — Autonomous Cyber Defense Platform
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <div className="live-dot" style={{ width: 6, height: 6 }} />
                      Auto-refresh every 5s
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Hour Heatmap (inline — no extra file needed) ─────────────────────────────
function HourHeatmap({ alerts }) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i)
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const grid = useMemo(() => {
    const map = {}
    alerts.forEach(a => {
      if (!a.created_at) return
      const d = new Date(a.created_at)
      const key = `${d.getDay()}-${d.getHours()}`
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [alerts])

  const maxVal = Math.max(1, ...Object.values(grid))

  const cellColor = (val) => {
    if (!val) return 'rgba(255,255,255,0.03)'
    const t = val / maxVal
    if (t > 0.7) return `rgba(239,68,68,${0.3 + t * 0.5})`
    if (t > 0.4) return `rgba(245,158,11,${0.25 + t * 0.4})`
    return `rgba(59,130,246,${0.15 + t * 0.35})`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="card p-5 h-full"
    >
      <div className="label-xs mb-1">Activity Pattern</div>
      <div className="text-[15px] font-semibold text-slate-200 mb-4">Threat Activity by Hour</div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 560 }}>
          {/* Hour labels */}
          <div className="flex items-center mb-1" style={{ paddingLeft: 36 }}>
            {HOURS.filter(h => h % 4 === 0).map(h => (
              <div key={h} className="text-[9px] text-slate-600 mono"
                style={{ width: `${100/6}%`, textAlign: 'center' }}>
                {h.toString().padStart(2, '0')}h
              </div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, di) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <div className="text-[9px] text-slate-600 w-8 flex-shrink-0 text-right pr-2">{day}</div>
              <div className="flex gap-0.5 flex-1">
                {HOURS.map(h => {
                  const val = grid[`${di}-${h}`] || 0
                  return (
                    <div
                      key={h}
                      className="flex-1 rounded-sm transition-all duration-300 cursor-default group relative"
                      style={{ height: 16, background: cellColor(val) }}
                      title={`${day} ${h.toString().padStart(2,'0')}:00 — ${val} alert${val !== 1 ? 's' : ''}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[10px] text-slate-600">Less</span>
            {['rgba(255,255,255,0.04)', 'rgba(59,130,246,0.3)', 'rgba(245,158,11,0.45)', 'rgba(239,68,68,0.6)', 'rgba(239,68,68,0.85)'].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
            ))}
            <span className="text-[10px] text-slate-600">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
