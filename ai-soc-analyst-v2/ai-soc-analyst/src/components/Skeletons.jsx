export function SkeletonCard({ height = 80 }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton w-9 h-9 rounded-xl" />
        <div className="skeleton w-12 h-5 rounded-full" />
      </div>
      <div className="skeleton w-14 h-8 rounded mb-2" />
      <div className="skeleton w-20 h-3 rounded" />
      <div className="skeleton w-full h-8 rounded mt-4" />
    </div>
  )
}

export function SkeletonChart({ height = 240 }) {
  return (
    <div className="card p-5">
      <div className="skeleton w-16 h-3 rounded mb-2" />
      <div className="skeleton w-40 h-5 rounded mb-5" />
      <div className="skeleton w-full rounded" style={{ height }} />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="skeleton w-16 h-3 rounded mb-2" />
          <div className="skeleton w-32 h-5 rounded" />
        </div>
        <div className="skeleton w-40 h-8 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton w-full h-11 rounded-lg" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    </div>
  )
}
