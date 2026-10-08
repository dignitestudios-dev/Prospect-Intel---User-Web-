import { ArrowDown, ArrowUp, ChevronsUpDown, Heart, MapPin } from "lucide-react";
import Avatar from "../../ui/Avatar";
import CollegeLogo from "../../ui/CollegeLogo";
import GradeStamp from "../../ui/GradeStamp";
import { Checkbox } from "../../ui/Field";
import { cn } from "../../ui/cn";
import { StatusTags } from "./StatusTag";
import { TableSkeleton, CardGridSkeleton } from "../global/Skeleton";

const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);

function SaveButton({ saved, busy, name, onClick, className }) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name || "athlete"} from Saved` : `Save ${name || "athlete"}`}
      title={saved ? "Saved. Click to remove" : "Save athlete"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-50",
        saved ? "text-red-600 hover:bg-red-50" : "text-ink-300 hover:bg-ink-100 hover:text-ink-600",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}

function SortHeader({ label, sortKey, sortBy, sortOrder, onSort, title }) {
  const active = sortBy === sortKey;
  const Icon = !active ? ChevronsUpDown : sortOrder === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onSort?.(sortKey)}
      title={title || `Sort by ${label}`}
      aria-label={`Sort by ${label}`}
      className={cn("th group inline-flex items-center gap-1 transition-colors", active ? "!text-ink" : "hover:text-ink")}
    >
      {label}
      <Icon className={cn("h-3 w-3", active ? "opacity-100" : "opacity-0 group-hover:opacity-60")} />
    </button>
  );
}

function College({ college }) {
  if (!college?.name) return <span className="text-ink-300">—</span>;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <CollegeLogo src={college.logo} className="h-5 w-5" />
      <span className="truncate">{college.name}</span>
    </span>
  );
}

/* ----------------------------- Table (md and up) ----------------------------- */

function AthleteTable({
  athletes,
  loading,
  selectedIds,
  toggleOne,
  toggleAll,
  allSelected,
  someSelected,
  sortBy,
  sortOrder,
  onSort,
  onOpen,
  onToggleSave,
  savingId,
  forceSaved,
}) {
  const sortProps = { sortBy, sortOrder, onSort };
  return (
    <div className="card hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead className="bg-white/45">
            <tr className="border-b border-ink-900/10">
              <th className="w-10 py-2.5 pl-4 pr-1">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  aria-label="Select all athletes on this page"
                />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Athlete" sortKey="Player" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Class" sortKey="Grad" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Position" sortKey="Position" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Football" sortKey="Football Character" title="Sort by football character grade" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Personal" sortKey="Personal Character" title="Sort by personal character grade" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Height" sortKey="Height" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Weight" sortKey="Width" title="Sort by weight" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="High school" sortKey="High School" {...sortProps} />
              </th>
              <th className="px-3 py-2.5">
                <SortHeader label="Committed" sortKey="Committed College" {...sortProps} />
              </th>
              <th className="w-12 py-2.5 pl-1 pr-3">
                <span className="sr-only">Save</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={8} columns={10} />
            ) : (
              athletes.map((p) => {
                const b = p.basicInfo || {};
                const selected = selectedIds.includes(p._id);
                const saved = forceSaved ?? Boolean(p.isSaved);
                return (
                  <tr
                    key={p._id}
                    onClick={() => onOpen(p)}
                    className={cn(
                      "group cursor-pointer border-b border-ink-900/[0.06] text-[13px] transition-colors last:border-0",
                      selected ? "bg-signal/10" : "hover:bg-white/60",
                    )}
                  >
                    <td className="py-2 pl-4 pr-1" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onChange={() => toggleOne(p._id)}
                        aria-label={`Select ${b.name || "athlete"}`}
                      />
                    </td>
                    <td className="max-w-[260px] px-3 py-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={b.image} name={b.name} size="sm" />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(p);
                            }}
                            className="block max-w-full truncate rounded text-left font-semibold text-ink hover:text-signal-700 hover:underline"
                          >
                            {b.name || "Unnamed athlete"}
                          </button>
                          {Array.isArray(b.status) && b.status.length > 0 && (
                            <div className="mt-0.5">
                              <StatusTags tags={b.status} max={1} />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{dash(b.gradYear)}</td>
                    <td className="px-3 py-2 text-ink-700">{dash(b.position)}</td>
                    <td className="px-3 py-2">
                      <GradeStamp grade={p.athlete?.footballPiScore} size="sm" title={`Football character: ${p.athlete?.footballPiScore || "not graded"}`} />
                    </td>
                    <td className="px-3 py-2">
                      <GradeStamp grade={p.athlete?.personalPiScore} size="sm" title={`Personal character: ${p.athlete?.personalPiScore || "not graded"}`} />
                    </td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{dash(b.height)}</td>
                    <td className="px-3 py-2 tabular-nums text-ink-700">{b.weight ? `${b.weight} lb` : "—"}</td>
                    <td className="max-w-[190px] px-3 py-2">
                      <p className="truncate text-ink-700" title={b.schoolName}>
                        {dash(b.schoolName)}
                      </p>
                      {b.state && <p className="truncate text-xs text-ink-500">{b.state}</p>}
                    </td>
                    <td className="max-w-[180px] px-3 py-2 text-ink-700">
                      <College college={b.committedCollege} />
                    </td>
                    <td className="py-2 pl-1 pr-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <SaveButton
                        saved={saved}
                        busy={savingId === p._id}
                        name={b.name}
                        onClick={() => onToggleSave(p._id, saved)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------ Cards (all sizes) ------------------------------ */

function AthleteCard({ p, selected, onToggle, onOpen, onToggleSave, savingId, forceSaved }) {
  const b = p.basicInfo || {};
  const saved = forceSaved ?? Boolean(p.isSaved);
  return (
    <article
      onClick={() => onOpen(p)}
      className={cn(
        "card cursor-pointer p-4 transition-all hover:-translate-y-px hover:bg-white/75",
        selected && "border-signal ring-1 ring-signal/40",
      )}
    >
      <div className="flex items-start gap-3">
        <div onClick={(e) => e.stopPropagation()} className="pt-3">
          <Checkbox checked={selected} onChange={onToggle} aria-label={`Select ${b.name || "athlete"}`} />
        </div>
        <Avatar src={b.image} name={b.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold leading-tight text-ink">{b.name || "Unnamed athlete"}</h3>
          <p className="mt-0.5 truncate text-xs text-ink-500">
            {[b.position, b.gradYear && `Class of ${b.gradYear}`].filter(Boolean).join(" · ") || "—"}
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-ink-500">
            <MapPin className="h-3 w-3 shrink-0 text-ink-300" aria-hidden="true" />
            <span className="truncate">{[b.schoolName, b.state].filter(Boolean).join(", ") || "—"}</span>
          </p>
        </div>
        <SaveButton
          saved={saved}
          busy={savingId === p._id}
          name={b.name}
          onClick={() => onToggleSave(p._id, saved)}
          className="-mr-1 -mt-1"
        />
      </div>

      <dl className="mt-4 grid grid-cols-4 gap-x-3 gap-y-3 border-t border-ink-900/10 pt-3 text-xs">
        <div>
          <dt className="text-ink-500">Football</dt>
          <dd className="mt-1">
            <GradeStamp grade={p.athlete?.footballPiScore} size="sm" />
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Personal</dt>
          <dd className="mt-1">
            <GradeStamp grade={p.athlete?.personalPiScore} size="sm" />
          </dd>
        </div>
        <div>
          <dt className="text-ink-500">Height</dt>
          <dd className="mt-1.5 text-[13px] font-medium tabular-nums text-ink">{dash(b.height)}</dd>
        </div>
        <div>
          <dt className="text-ink-500">Weight</dt>
          <dd className="mt-1.5 text-[13px] font-medium tabular-nums text-ink">{b.weight ? `${b.weight} lb` : "—"}</dd>
        </div>
      </dl>

      {(b.committedCollege?.name || (Array.isArray(b.status) && b.status.length > 0)) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink-900/10 pt-3">
          {Array.isArray(b.status) && b.status.length > 0 ? <StatusTags tags={b.status} max={2} /> : <span />}
          {b.committedCollege?.name && (
            <span className="flex min-w-0 items-center gap-1.5 text-xs text-ink-600">
              <span className="text-ink-500">Committed</span>
              <College college={b.committedCollege} />
            </span>
          )}
        </div>
      )}
    </article>
  );
}

function AthleteCards({ athletes, loading, selectedIds, toggleOne, onOpen, onToggleSave, savingId, forceSaved, className }) {
  if (loading) {
    return (
      <div className={className}>
        <CardGridSkeleton count={6} />
      </div>
    );
  }
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {athletes.map((p) => (
        <AthleteCard
          key={p._id}
          p={p}
          selected={selectedIds.includes(p._id)}
          onToggle={() => toggleOne(p._id)}
          onOpen={onOpen}
          onToggleSave={onToggleSave}
          savingId={savingId}
          forceSaved={forceSaved}
        />
      ))}
    </div>
  );
}

/* --------------------------------- Wrapper --------------------------------- */

/**
 * Renders athletes as a table (md+) or cards. On phones it always uses cards.
 * Selection is controlled by the page (selectedIds / setSelectedIds).
 * `emptyState` is shown when there is nothing to list.
 */
export default function AthleteResults({
  athletes = [],
  loading,
  view = "table",
  selectedIds,
  setSelectedIds,
  sortBy,
  sortOrder,
  onSort,
  onOpen,
  onToggleSave,
  savingId,
  forceSaved,
  emptyState,
}) {
  const ids = athletes.map((a) => a._id);
  const allSelected = ids.length > 0 && ids.every((id) => selectedIds.includes(id));
  const someSelected = !allSelected && ids.some((id) => selectedIds.includes(id));

  const toggleOne = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () => setSelectedIds(allSelected ? [] : ids);

  if (!loading && athletes.length === 0) {
    return <div className="card">{emptyState}</div>;
  }

  const shared = { athletes, loading, selectedIds, toggleOne, onOpen, onToggleSave, savingId, forceSaved };

  return (
    <>
      {view === "table" && (
        <AthleteTable
          {...shared}
          toggleAll={toggleAll}
          allSelected={allSelected}
          someSelected={someSelected}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      )}
      {/* Cards: always on phones; on larger screens when the user picks the card view. */}
      <AthleteCards {...shared} className={view === "table" ? "md:hidden" : ""} />
    </>
  );
}
