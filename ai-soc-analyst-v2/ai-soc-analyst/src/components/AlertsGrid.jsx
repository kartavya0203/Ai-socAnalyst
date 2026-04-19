import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'

const RiskPill = ({ risk }) => {
  const cls = risk === 'High' ? 'pill-high' : risk === 'Medium' ? 'pill-medium' : 'pill-low'
  return <span className={cls}>{risk}</span>
}

const PredBadge = ({ prediction }) => {
  const isAnom = prediction === 'anomaly'
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isAnom ? 'rgba(249,115,22,0.12)' : 'rgba(16,185,129,0.12)',
        color: isAnom ? '#FB923C' : '#34D399',
        border: `1px solid ${isAnom ? 'rgba(249,115,22,0.3)' : 'rgba(16,185,129,0.3)'}`,
      }}>
      {isAnom ? 'anomaly' : 'normal'}
    </span>
  )
}

const ConfBar = ({ value }) => {
  const pct = Math.min(100, Math.max(0, Number(value) || 0))
  const color = pct >= 70 ? '#F87171' : pct >= 45 ? '#FCD34D' : '#34D399'
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="mono text-[11px] text-slate-400 w-9 text-right">{pct}%</span>
    </div>
  )
}

const ProtoBadge = ({ proto }) => (
  <span className="mono text-[10px] px-2 py-0.5 rounded-md font-semibold"
    style={{
      background: proto === 'TCP' ? 'rgba(59,130,246,0.1)' : proto === 'UDP' ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)',
      color: proto === 'TCP' ? '#60A5FA' : proto === 'UDP' ? '#A78BFA' : '#FCD34D',
      border: `1px solid ${proto === 'TCP' ? 'rgba(59,130,246,0.22)' : proto === 'UDP' ? 'rgba(139,92,246,0.22)' : 'rgba(245,158,11,0.22)'}`,
    }}>
    {proto}
  </span>
)

const RISK_ORDER = { High: 0, Medium: 1, Low: 2 }
const PAGE_SIZE = 8
const FILTERS = ['All', 'High', 'Medium', 'Low']

const COLS = [
  { k: 'risk', l: 'Severity', sort: true },
  { k: 'src_ip', l: 'Source IP', sort: true },
  { k: 'dst_ip', l: 'Dest IP', sort: true },
  { k: 'protocol', l: 'Proto', sort: true },
  { k: 'packet_size', l: 'Pkt Size', sort: true },
  { k: 'duration', l: 'Duration', sort: true },
  { k: 'prediction', l: 'Prediction', sort: true },
  { k: 'confidence', l: 'Confidence', sort: true },
  { k: 'attack_type', l: 'Attack Type', sort: true },
  { k: 'action', l: 'Action', sort: false },
  { k: 'created_at', l: 'Time', sort: true },
]

export default function AlertsGrid({ alerts }) {
  const [search, setSearch] = useState('')
  const [riskF, setRiskF] = useState('All')
  const [sortKey, setSortKey] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return alerts.filter(a =>
      (riskF === 'All' || a.risk === riskF) &&
      (!q || [a.src_ip, a.dst_ip, a.attack_type, a.protocol, a.action, a.prediction]
        .some(v => String(v ?? '').toLowerCase().includes(q)))
    )
  }, [alerts, search, riskF])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (sortKey === 'risk') { va = RISK_ORDER[va] ?? 9; vb = RISK_ORDER[vb] ?? 9 }
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va
      va = String(va ?? ''); vb = String(vb ?? '')
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }, [filtered, sortKey, sortDir])

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const doSort = k => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
    setPage(1)
  }

  const fmtTime = ts => {
    if (!ts) return '—'
    const d = new Date(ts)
    return d.toLocaleTimeString('en-US', { hour12: false }) + '\n' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <div className="label-xs mb-0.5">Security Events</div>
          <div className="text-[15px] font-semibold text-slate-200">
            Alert Feed
            <span className="ml-2 text-[12px] font-normal text-slate-500">({filtered.length} records)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Risk filter */}
          <div className="flex gap-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => { setRiskF(f); setPage(1) }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150"
                style={{
                  background: riskF === f ? 'rgba(59,130,246,0.14)' : 'rgba(255,255,255,0.04)',
                  color: riskF === f ? '#60A5FA' : '#475569',
                  border: `1px solid ${riskF === f ? 'rgba(59,130,246,0.32)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search…"
              className="input-base pl-7 pr-3 py-1.5 text-[12px] w-36"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {COLS.map(c => (
                <th key={c.k}
                  onClick={() => c.sort && doSort(c.k)}
                  className={c.sort ? 'cursor-pointer select-none hover:text-slate-300 transition-colors' : ''}>
                  <span className="inline-flex items-center gap-1">
                    {c.l}
                    {c.sort && sortKey === c.k
                      ? (sortDir === 'asc'
                        ? <ChevronUp size={10} className="text-blue-400" />
                        : <ChevronDown size={10} className="text-blue-400" />)
                      : c.sort ? <ChevronDown size={10} className="text-slate-700" /> : null
                    }
                  </span>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={COLS.length + 1} className="py-12 text-center text-slate-600 text-[13px]">No matching alerts</td></tr>
            ) : rows.map(alert => (
              <>
                <tr key={alert.id} onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}>
                  <td><RiskPill risk={alert.risk} /></td>
                  <td><span className="mono text-[12px] text-blue-400">{alert.src_ip}</span></td>
                  <td><span className="mono text-[12px] text-slate-400">{alert.dst_ip}</span></td>
                  <td><ProtoBadge proto={alert.protocol} /></td>
                  <td><span className="mono text-[12px]">{(alert.packet_size ?? 0).toLocaleString()}</span></td>
                  <td><span className="mono text-[12px]">{alert.duration ?? 0}s</span></td>
                  <td><PredBadge prediction={alert.prediction} /></td>
                  <td><ConfBar value={alert.confidence} /></td>
                  <td><span className="text-[12px] text-slate-300 font-medium">{alert.attack_type}</span></td>
                  <td><span className="text-[12px] text-slate-500 max-w-[150px] block truncate" title={alert.action}>{alert.action}</span></td>
                  <td><span className="mono text-[10px] text-slate-500 whitespace-pre-line leading-tight">{fmtTime(alert.created_at)}</span></td>
                  <td>
                    <motion.div animate={{ rotate: expanded === alert.id ? 90 : 0 }} transition={{ duration: 0.15 }}>
                      <ChevronRight size={13} className="text-slate-600" />
                    </motion.div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expanded === alert.id && (
                    <motion.tr key={`exp-${alert.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan={COLS.length + 1}
                        style={{ background: 'rgba(59,130,246,0.03)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
                        <div className="px-2 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div>
                            <div className="label-xs mb-1">Reason / Detail</div>
                            <div className="text-[12px] text-slate-300 leading-relaxed">{alert.reason || '—'}</div>
                          </div>
                          <div>
                            <div className="label-xs mb-1">Packet / Duration</div>
                            <div className="mono text-[12px] text-slate-300">{(alert.packet_size || 0).toLocaleString()} B &nbsp;·&nbsp; {alert.duration ?? 0}s</div>
                          </div>
                          <div>
                            <div className="label-xs mb-1">ML Confidence</div>
                            <div className="mono text-[14px] font-bold" style={{ color: Number(alert.confidence || 0) >= 70 ? '#F87171' : Number(alert.confidence || 0) >= 45 ? '#FCD34D' : '#34D399' }}>
                              {alert.confidence ?? '—'}%
                            </div>
                          </div>
                          <div>
                            <div className="label-xs mb-1">Alert ID</div>
                            <div className="mono text-[12px] text-blue-400">#{String(alert.id).padStart(6, '0')}</div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[11px] text-slate-600">Page {page} of {pages}</span>
          <div className="flex gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 rounded-lg text-[11px] font-medium disabled:opacity-30 transition-colors hover:bg-white/5"
              style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.07)' }}>Prev</button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-7 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: page === p ? 'rgba(59,130,246,0.14)' : 'rgba(255,255,255,0.04)',
                  color: page === p ? '#60A5FA' : '#64748B',
                  border: `1px solid ${page === p ? 'rgba(59,130,246,0.32)' : 'rgba(255,255,255,0.07)'}`,
                }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="px-3 py-1 rounded-lg text-[11px] font-medium disabled:opacity-30 transition-colors hover:bg-white/5"
              style={{ color: '#94A3B8', border: '1px solid rgba(255,255,255,0.07)' }}>Next</button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
