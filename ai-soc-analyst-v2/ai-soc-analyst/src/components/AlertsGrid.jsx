import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, Filter, ChevronRight } from 'lucide-react'

const SeverityPill = ({ risk }) => (
  <span className={`pill-${risk === 'High' ? 'high' : risk === 'Medium' ? 'medium' : 'low'}`}>
    {risk}
  </span>
)

const ProtoBadge = ({ proto }) => (
  <span className="mono text-[11px] px-2 py-0.5 rounded-md font-medium"
    style={{
      background: proto === 'TCP' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
      color: proto === 'TCP' ? '#60A5FA' : '#A78BFA',
      border: `1px solid ${proto === 'TCP' ? 'rgba(59,130,246,0.25)' : 'rgba(139,92,246,0.25)'}`,
    }}>
    {proto}
  </span>
)

const RISK_FILTERS = ['All', 'High', 'Medium', 'Low']
const PAGE_SIZE = 8

export default function AlertsGrid({ alerts }) {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('All')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return alerts.filter(a =>
      (riskFilter === 'All' || a.risk === riskFilter) &&
      (!q || [a.src_ip, a.dst_ip, a.attack_type, a.protocol, a.action].some(v => v?.toLowerCase().includes(q)))
    )
  }, [alerts, search, riskFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey]
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va
      va = String(va ?? ''); vb = String(vb ?? '')
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }, [filtered, sortKey, sortDir])

  const pages = Math.ceil(sorted.length / PAGE_SIZE)
  const rows = sorted.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  const handleSort = k => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
    setPage(1)
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronDown size={11} className="text-slate-700 ml-1" />
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-blue-400 ml-1" />
      : <ChevronDown size={11} className="text-blue-400 ml-1" />
  }

  const fmtTime = ts => {
    if (!ts) return '—'
    return new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div>
          <div className="label-xs mb-0.5">Security Events</div>
          <div className="text-[15px] font-semibold text-slate-200">
            Alert Feed
            <span className="ml-2 text-[12px] text-slate-500 font-normal">({filtered.length} records)</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Risk filter pills */}
          <div className="flex gap-1.5">
            {RISK_FILTERS.map(r => (
              <button key={r} onClick={() => { setRiskFilter(r); setPage(1) }}
                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-15"
                style={{
                  background: riskFilter === r ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  color: riskFilter === r ? '#60A5FA' : '#475569',
                  border: `1px solid ${riskFilter === r ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                {r}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search..."
              className="input-base pl-8 pr-3 py-1.5 text-[12px] w-44"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {[
                { k: 'risk',        l: 'Severity' },
                { k: 'src_ip',      l: 'Source IP' },
                { k: 'dst_ip',      l: 'Dest IP' },
                { k: 'protocol',    l: 'Proto' },
                { k: 'attack_type', l: 'Threat Type' },
                { k: 'action',      l: 'Recommended Action' },
                { k: 'created_at',  l: 'Timestamp' },
              ].map(c => (
                <th key={c.k} onClick={() => handleSort(c.k)} className="cursor-pointer select-none hover:text-slate-400 transition-colors">
                  <span className="inline-flex items-center">{c.l}<SortIcon col={c.k} /></span>
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="py-10 text-center text-slate-600">No matching alerts</td></tr>
            ) : rows.map(alert => (
              <>
                <tr key={alert.id} onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}>
                  <td><SeverityPill risk={alert.risk} /></td>
                  <td className="ip">{alert.src_ip}</td>
                  <td className="ip text-slate-400">{alert.dst_ip}</td>
                  <td><ProtoBadge proto={alert.protocol} /></td>
                  <td className="text-slate-300 font-medium">{alert.attack_type}</td>
                  <td className="text-slate-500 max-w-[180px] truncate" title={alert.action}>{alert.action}</td>
                  <td className="mono text-slate-500 text-[11px]">{fmtTime(alert.created_at)}</td>
                  <td>
                    <motion.div animate={{ rotate: expanded === alert.id ? 90 : 0 }}>
                      <ChevronRight size={14} className="text-slate-600" />
                    </motion.div>
                  </td>
                </tr>
                <AnimatePresence>
                  {expanded === alert.id && (
                    <motion.tr
                      key={`exp-${alert.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={8} style={{ background: 'rgba(59,130,246,0.03)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                        <div className="px-2 py-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <div className="label-xs mb-1">Reason</div>
                            <div className="text-[12px] text-slate-300">{alert.reason || '—'}</div>
                          </div>
                          <div>
                            <div className="label-xs mb-1">Packet Size / Duration</div>
                            <div className="mono text-[12px] text-slate-300">{alert.packet_size?.toLocaleString()} B &nbsp;/&nbsp; {alert.duration}s</div>
                          </div>
                          <div>
                            <div className="label-xs mb-1">Alert ID</div>
                            <div className="mono text-[12px] text-blue-400">#{String(alert.id).padStart(6,'0')}</div>
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
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span className="text-[12px] text-slate-500">Page {page} of {pages}</span>
          <div className="flex gap-1.5">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              className="px-3 py-1 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94A3B8' }}>
              Prev
            </button>
            {Array.from({length: Math.min(5, pages)}, (_,i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className="w-8 h-7 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: page===p ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${page===p ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  color: page===p ? '#60A5FA' : '#64748B',
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages}
              className="px-3 py-1 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#94A3B8' }}>
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
