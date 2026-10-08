// Loading placeholders. Shapes mirror the real layouts so the page doesn't jump.

export const Skeleton = ({ className = "", style }) => (
  <div className={`animate-pulse rounded-md bg-ink-900/[0.07] ${className}`} style={style} aria-hidden="true" />
);

/** Rows that match the athlete table layout (used inside <tbody>). */
export const TableSkeleton = ({ rows = 6, columns = 8 }) => (
  <>
    {Array.from({ length: rows }).map((_, r) => (
      <tr key={r} className="border-b border-ink-900/[0.06] last:border-0">
        <td className="w-10 py-3.5 pl-4 pr-1">
          <Skeleton className="h-4 w-4" />
        </td>
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </td>
        {Array.from({ length: columns - 2 }).map((_, c) => (
          <td key={c} className="px-3 py-3.5">
            <Skeleton className="h-3.5 w-16" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const CardGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    ))}
  </div>
);

const SkelPanel = ({ titleW = "w-40", children, className = "" }) => (
  <div className={`card overflow-hidden ${className}`}>
    <div className="flex items-center justify-between gap-3 border-b border-ink-900/10 px-5 py-3.5 sm:px-6">
      <Skeleton className={`h-4 ${titleW}`} />
    </div>
    <div className="p-5 sm:p-6">{children}</div>
  </div>
);

const TextLines = ({ lines = 3 }) => (
  <div className="space-y-2.5">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
    ))}
  </div>
);

/** Mirrors the athlete profile page: header card, tab bar, main and side columns. */
export const ProfileSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6" role="status" aria-label="Loading athlete profile">
    {/* back and browse */}
    <div className="mb-4 flex items-center justify-between gap-3">
      <Skeleton className="h-8 w-36 rounded-lg" />
      <div className="hidden items-center gap-1.5 sm:flex">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>

    {/* identity */}
    <div className="card overflow-hidden">
      <div className="px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4 sm:gap-5">
            <Skeleton className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24" />
            <div className="min-w-0 flex-1 space-y-2.5 pt-0.5">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-7 w-56 sm:w-72" />
              <Skeleton className="h-3.5 w-44" />
              <div className="flex gap-2 pt-1.5">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-ink-900/10 border-t border-ink-900/10 bg-white/35 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* tab bar */}
    <div className="glass mt-5 flex items-center justify-between gap-3 overflow-hidden rounded-xl px-4 py-3.5">
      <div className="flex gap-6">
        {[80, 96, 64, 96, 48].map((w, i) => (
          <Skeleton key={i} className="h-3.5" style={{ width: w }} />
        ))}
      </div>
      <div className="hidden gap-2 lg:flex">
        <Skeleton className="h-7 w-7 rounded-lg" />
        <Skeleton className="h-7 w-28 rounded-lg" />
      </div>
    </div>

    <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
      {/* main column */}
      <div className="min-w-0 space-y-5">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-ink-900/10 px-5 py-3.5 sm:px-6">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="grid md:grid-cols-2 md:divide-x md:divide-ink-900/10">
            {[0, 1].map((i) => (
              <div key={i} className={`p-5 sm:p-6 ${i === 1 ? "border-t border-ink-900/10 md:border-t-0" : ""}`}>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-[92px] w-[92px] shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="mt-5">
                  <TextLines lines={4} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <SkelPanel titleW="w-40">
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </SkelPanel>

        <div className="grid gap-5 md:grid-cols-2">
          {[0, 1].map((i) => (
            <SkelPanel key={i} titleW="w-24">
              <div className="space-y-3">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
                    <Skeleton className={`h-3.5 ${j === 2 ? "w-1/2" : "w-5/6"}`} />
                  </div>
                ))}
              </div>
            </SkelPanel>
          ))}
        </div>

        <SkelPanel titleW="w-52">
          <div className="divide-y divide-ink-900/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
                <Skeleton className="mt-0.5 h-8 w-11 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </SkelPanel>
      </div>

      {/* side column */}
      <aside className="min-w-0 space-y-5">
        <SkelPanel titleW="w-20">
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-lg border border-white/80 bg-white/45 p-3.5">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="mt-2 h-4 w-3/5" />
                <Skeleton className="mt-2 h-3 w-4/5" />
              </div>
            ))}
          </div>
          <Skeleton className="mb-2 mt-5 h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="mb-2 mt-5 h-3 w-24" />
          <div className="rounded-lg border border-white/80 bg-white/45 p-3.5">
            <Skeleton className="mb-2 h-4 w-4" />
            <TextLines lines={3} />
          </div>
        </SkelPanel>

        <div className="card p-5">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="mt-3 h-4 w-36" />
          <div className="mt-2">
            <TextLines lines={3} />
          </div>
          <Skeleton className="mt-3.5 h-10 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  </div>
);
