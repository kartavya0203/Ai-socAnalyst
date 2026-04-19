import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export default function ConfidenceGauge({ alerts }) {
    const stats = useMemo(() => {
        const withConf = alerts
            .map(a => Number(a?.confidence))
            .filter(v => !isNaN(v) && v > 0)

        if (!withConf.length) {
            return { avg: 0, max: 0, dist: [0, 0, 0, 0, 0], total: 0 }
        }

        const avg = Math.round(
            withConf.reduce((sum, val) => sum + val, 0) / withConf.length
        )

        const max = Math.max(...withConf)

        const buckets = [0, 0, 0, 0, 0]

        withConf.forEach(c => {
            const idx = Math.min(4, Math.floor(c / 20))
            buckets[idx]++
        })

        return {
            avg,
            max,
            dist: buckets,
            total: withConf.length
        }
    }, [alerts])

    const gaugeColor = stats.avg >= 70 ? '#F87171' : stats.avg >= 45 ? '#FCD34D' : '#34D399'
    const pct = stats.avg / 100

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="card p-5 h-full flex flex-col"
        >
            <div className="label-xs mb-0.5">ML Detection Engine</div>
            <div className="text-[15px] font-semibold text-slate-200 mb-4">Confidence Gauge</div>

            {/* Arc gauge */}
            <div className="flex items-center justify-center mb-4">
                <div className="relative w-36 h-20 overflow-hidden">
                    <svg viewBox="0 0 120 66" className="w-full h-full">
                        {/* Track arc (180°) */}
                        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
                        {/* Value arc */}
                        <motion.path
                            d="M 10 60 A 50 50 0 0 1 110 60"
                            fill="none"
                            stroke={gaugeColor}
                            strokeWidth="10"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: pct }}
                            transition={{ duration: 1.3, ease: 'easeOut' }}
                            style={{ filter: `drop-shadow(0 0 5px ${gaugeColor})` }}
                        />
                        {/* Center text */}
                        <text x="60" y="56" textAnchor="middle" fontSize="18" fontWeight="700" fill={gaugeColor} fontFamily="Inter,sans-serif">{stats.avg}%</text>
                    </svg>
                </div>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-[18px] font-bold text-slate-200">{stats.avg}%</div>
                    <div className="label-xs">Avg Confidence</div>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-[18px] font-bold" style={{ color: gaugeColor }}>{stats.max}%</div>
                    <div className="label-xs">Peak Confidence</div>
                </div>
            </div>

            {/* Distribution bars */}
            <div className="space-y-2">
                {['0–20%', '20–40%', '40–60%', '60–80%', '80–100%'].map((label, i) => {
                    const count = stats.dist[i] || 0
                    const pctW = stats.total ? (count / stats.total) * 100 : 0
                    const barColor = i <= 1 ? '#34D399' : i === 2 ? '#FCD34D' : i === 3 ? '#F97316' : '#F87171'
                    return (
                        <div key={label} className="flex items-center gap-2">
                            <div className="text-[10px] text-slate-600 mono w-14 flex-shrink-0">{label}</div>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: barColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pctW}%` }}
                                    transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                                />
                            </div>
                            <div className="text-[10px] text-slate-600 mono w-4 text-right">{count}</div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}
