import { useEffect, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import citiesData from "../../static/us";
import Popover from "../../ui/Popover";
import Dialog from "../../ui/Dialog";
import Button from "../../ui/Button";
import CollegeLogo from "../../ui/CollegeLogo";
import GradeStamp from "../../ui/GradeStamp";
import { GRADE_FILTER_OPTIONS, parseGrade } from "../../ui/grades";
import { cn } from "../../ui/cn";

export const POSITIONS = [
  { label: "QB", value: "Quarterback" },
  { label: "RB", value: "Running Back" },
  { label: "WR", value: "Wide Receiver" },
  { label: "TE", value: "Tight End" },
  { label: "OL", value: "Offensive Line" },
  { label: "DL", value: "Defensive Line" },
  { label: "LB", value: "Linebacker" },
  { label: "DB", value: "Defensive Back" },
  { label: "ATH", value: "Athlete" },
  { label: "SP", value: "Specialist" },
];

export const GRAD_YEARS = ["2027", "2028", "2029", "2030", "2031", "2032"];

const STATES = Object.keys(citiesData).sort((a, b) => a.localeCompare(b));

const optionBtn = (active) =>
  cn(
    "h-8 rounded-md border px-3 text-[13px] font-medium transition-colors",
    active
      ? "border-signal bg-signal-50 text-signal-700"
      : "border-white/80 bg-white/70 text-ink-600 hover:bg-white",
  );

/* ------------------------------ Filter pieces ------------------------------ */

function PositionGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {POSITIONS.map((p) => (
        <button
          key={p.value}
          type="button"
          title={p.value}
          aria-label={p.value}
          aria-pressed={value === p.value}
          onClick={() => onChange(value === p.value ? "" : p.value)}
          className={cn(optionBtn(value === p.value), "px-0")}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function YearGrid({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {GRAD_YEARS.map((y) => (
        <button
          key={y}
          type="button"
          onClick={() => onChange(value === y ? "" : y)}
          aria-pressed={value === y}
          className={cn(optionBtn(value === y), "px-0 tabular-nums")}
        >
          {y}
        </button>
      ))}
    </div>
  );
}

function GradeGrid({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Character grade">
      {GRADE_FILTER_OPTIONS.map((g) => {
        const active = value === g;
        const meta = parseGrade(g);
        return (
          <button
            key={g}
            type="button"
            onClick={() => onChange(active ? "" : g)}
            aria-pressed={active}
            aria-label={g === "N/A" ? "Not graded" : `${g}, ${meta.name}`}
            title={g === "N/A" ? "Not graded" : meta.name}
            className={cn(
              "rounded-lg p-1 transition-colors",
              active ? "bg-signal/10 ring-1 ring-signal" : "hover:bg-ink-900/5",
            )}
          >
            {g === "N/A" ? (
              <span className="inline-flex h-7 min-w-8 items-center justify-center rounded-md bg-ink-100 px-2 text-[13px] font-semibold text-ink-500 ring-1 ring-inset ring-ink-300/60">
                N/A
              </span>
            ) : (
              <GradeStamp grade={g} size="md" className="min-w-9" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function SchoolList({ schools, loading, selected, onSelect, search, setSearch }) {
  const list = schools?.data || [];
  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search colleges"
          aria-label="Search colleges"
          className="h-9 w-full rounded-md border border-ink-200 pl-8 pr-3 text-sm placeholder:text-ink-400 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <ul className="mt-2 max-h-60 overflow-y-auto" role="listbox" aria-label="Committed college">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex animate-pulse items-center gap-3 px-2 py-2">
              <span className="h-5 w-5 rounded bg-ink-100" />
              <span className="h-3 w-2/3 rounded bg-ink-100" />
            </li>
          ))
        ) : list.length === 0 ? (
          <li className="px-2 py-6 text-center text-[13px] text-ink-500">No colleges match “{search}”.</li>
        ) : (
          list.map((s) => {
            const active = selected?.id === s._id;
            return (
              <li key={s._id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => onSelect(active ? null : { id: s._id, name: s.name })}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
                    active ? "bg-signal-50 font-medium text-signal-700" : "text-ink-700 hover:bg-ink-50",
                  )}
                >
                  <CollegeLogo src={s.logo} className="h-5 w-5" />
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  {active && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

function LocationFields({ state, city, onState, onCity }) {
  const cities = state ? [...(citiesData[state] || [])].sort((a, b) => a.localeCompare(b)) : [];
  const select =
    "h-9 w-full rounded-md border border-ink-200 bg-white px-2.5 text-sm text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 disabled:bg-ink-50 disabled:text-ink-400";
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-600">State</span>
        <select value={state} onChange={(e) => onState(e.target.value)} className={select}>
          <option value="">All states</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-600">City</span>
        <select value={city} onChange={(e) => onCity(e.target.value)} disabled={!state} className={select}>
          <option value="">{state ? "All cities" : "Choose a state first"}</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="border-b border-ink-900/10 py-4 first:pt-0 last:border-0">
      <h3 className="mb-2.5 text-[13px] font-semibold text-ink">{title}</h3>
      {children}
    </section>
  );
}

/* ------------------------- Slide-over (right-hand) ------------------------- */

const EMPTY_DRAFT = { position: "", gradYear: "", footballGrade: "", personalGrade: "", school: null, state: "", city: "" };

/**
 * A second way to filter: every criterion in one right-hand panel.
 * Choices are staged and only applied when "Apply filters" is pressed.
 */
function FilterDrawer({ open, onClose, f, set, schools, schoolsLoading, schoolSearch, setSchoolSearch }) {
  const [draft, setDraft] = useState(f);

  // Each time the panel opens it starts from what is currently applied.
  useEffect(() => {
    if (open) setDraft(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pick = (key) => (v) => setDraft((p) => ({ ...p, [key]: v }));
  const count = [draft.position, draft.gradYear, draft.footballGrade, draft.personalGrade, draft.school, draft.state].filter(Boolean).length;

  const apply = () => {
    set.position(draft.position);
    set.gradYear(draft.gradYear);
    set.footballGrade(draft.footballGrade);
    set.personalGrade(draft.personalGrade);
    set.school(draft.school);
    set.state(draft.state); // clears the city...
    set.city(draft.city); // ...then the chosen city is set
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      variant="drawer"
      title="All filters"
      description="Choose your criteria, then apply them to the list."
      footer={
        <>
          <Button variant="ghost" onClick={() => setDraft(EMPTY_DRAFT)} disabled={count === 0}>
            Reset
          </Button>
          <Button variant="primary" onClick={apply} data-autofocus>
            Apply filters{count > 0 ? ` (${count})` : ""}
          </Button>
        </>
      }
    >
      <Section title="Position">
        <PositionGrid value={draft.position} onChange={pick("position")} />
      </Section>
      <Section title="Class year">
        <YearGrid value={draft.gradYear} onChange={pick("gradYear")} />
      </Section>
      <Section title="Football character">
        <GradeGrid value={draft.footballGrade} onChange={pick("footballGrade")} />
      </Section>
      <Section title="Personal character">
        <GradeGrid value={draft.personalGrade} onChange={pick("personalGrade")} />
      </Section>
      <Section title="Committed college">
        <SchoolList
          schools={schools}
          loading={schoolsLoading}
          selected={draft.school}
          search={schoolSearch}
          setSearch={setSchoolSearch}
          onSelect={pick("school")}
        />
      </Section>
      <Section title="Location">
        <LocationFields
          state={draft.state}
          city={draft.city}
          onState={(v) => setDraft((p) => ({ ...p, state: v, city: "" }))}
          onCity={pick("city")}
        />
      </Section>
    </Dialog>
  );
}

/* ----------------------------- Desktop filter bar ----------------------------- */

function FilterButton({ label, value, triggerProps, open }) {
  const active = Boolean(value);
  return (
    <button
      type="button"
      {...triggerProps}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium backdrop-blur-md transition-colors",
        active
          ? "border-signal/40 bg-signal/10 text-signal-700"
          : "border-white/80 bg-white/65 text-ink-700 shadow-card hover:bg-white",
      )}
    >
      <span>{label}</span>
      {active && <span className="max-w-[120px] truncate font-semibold">{value}</span>}
      <ChevronDown className={cn("h-3.5 w-3.5 opacity-50 transition-transform", open && "rotate-180")} />
    </button>
  );
}

/**
 * All the filtering controls. `f` is the filter state, `set` the setters.
 * Renders popovers from md up and a single "Filters" button (bottom sheet) on phones.
 */
export function FilterBar({ f, set, schools, schoolsLoading, schoolSearch, setSchoolSearch, activeCount, onClearAll }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const locationLabel = f.city ? `${f.city}, ${f.state}` : f.state;
  const positionLabel = POSITIONS.find((p) => p.value === f.position)?.label;

  return (
    <>
      {/* md+: one popover per filter */}
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        <Popover
          label="Position"
          panelClassName="w-72 p-3"
          trigger={({ triggerProps, open }) => (
            <FilterButton label="Position" value={positionLabel} triggerProps={triggerProps} open={open} />
          )}
        >
          {({ close }) => (
            <PositionGrid
              value={f.position}
              onChange={(v) => {
                set.position(v);
                close();
              }}
            />
          )}
        </Popover>

        <Popover
          label="Class year"
          panelClassName="w-64 p-3"
          trigger={({ triggerProps, open }) => (
            <FilterButton label="Class" value={f.gradYear} triggerProps={triggerProps} open={open} />
          )}
        >
          {({ close }) => (
            <YearGrid
              value={f.gradYear}
              onChange={(v) => {
                set.gradYear(v);
                close();
              }}
            />
          )}
        </Popover>

        <Popover
          label="Football character"
          panelClassName="w-80 p-3"
          trigger={({ triggerProps, open }) => (
            <FilterButton label="Football grade" value={f.footballGrade} triggerProps={triggerProps} open={open} />
          )}
        >
          {({ close }) => (
            <GradeGrid
              value={f.footballGrade}
              onChange={(v) => {
                set.footballGrade(v);
                close();
              }}
            />
          )}
        </Popover>

        <Popover
          label="Personal character"
          panelClassName="w-80 p-3"
          trigger={({ triggerProps, open }) => (
            <FilterButton label="Personal grade" value={f.personalGrade} triggerProps={triggerProps} open={open} />
          )}
        >
          {({ close }) => (
            <GradeGrid
              value={f.personalGrade}
              onChange={(v) => {
                set.personalGrade(v);
                close();
              }}
            />
          )}
        </Popover>

        <Popover
          label="Committed college"
          panelClassName="w-72 p-3"
          trigger={({ triggerProps, open }) => (
            <FilterButton label="College" value={f.school?.name} triggerProps={triggerProps} open={open} />
          )}
        >
          {({ close }) => (
            <SchoolList
              schools={schools}
              loading={schoolsLoading}
              selected={f.school}
              search={schoolSearch}
              setSearch={setSchoolSearch}
              onSelect={(s) => {
                set.school(s);
                close();
              }}
            />
          )}
        </Popover>

        <Popover
          label="Location"
          panelClassName="w-64 p-3"
          trigger={({ triggerProps, open }) => (
            <FilterButton label="Location" value={locationLabel} triggerProps={triggerProps} open={open} />
          )}
        >
          <LocationFields state={f.state} city={f.city} onState={set.state} onCity={set.city} />
        </Popover>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium text-ink-500 hover:bg-white/60 hover:text-ink"
          >
            Clear all
          </button>
        )}

        <Button variant="secondary" onClick={() => setDrawerOpen(true)} className="ml-auto" aria-haspopup="dialog">
          <SlidersHorizontal className="h-4 w-4" />
          All filters
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-signal px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          f={f}
          set={set}
          schools={schools}
          schoolsLoading={schoolsLoading}
          schoolSearch={schoolSearch}
          setSchoolSearch={setSchoolSearch}
        />
      </div>

      {/* phones: one button, one sheet */}
      <div className="md:hidden">
        <Button variant="secondary" onClick={() => setSheetOpen(true)} className="w-full justify-center">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-signal px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
        <Dialog
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Filters"
          footer={
            <>
              <Button variant="ghost" onClick={onClearAll} disabled={activeCount === 0}>
                Clear all
              </Button>
              <Button variant="primary" onClick={() => setSheetOpen(false)}>
                Show results
              </Button>
            </>
          }
        >
          <Section title="Position">
            <PositionGrid value={f.position} onChange={set.position} />
          </Section>
          <Section title="Class year">
            <YearGrid value={f.gradYear} onChange={set.gradYear} />
          </Section>
          <Section title="Football character">
            <GradeGrid value={f.footballGrade} onChange={set.footballGrade} />
          </Section>
          <Section title="Personal character">
            <GradeGrid value={f.personalGrade} onChange={set.personalGrade} />
          </Section>
          <Section title="Committed college">
            <SchoolList
              schools={schools}
              loading={schoolsLoading}
              selected={f.school}
              search={schoolSearch}
              setSearch={setSchoolSearch}
              onSelect={set.school}
            />
          </Section>
          <Section title="Location">
            <LocationFields state={f.state} city={f.city} onState={set.state} onCity={set.city} />
          </Section>
        </Dialog>
      </div>
    </>
  );
}

/* ------------------------------ Applied filters ------------------------------ */

export function AppliedChips({ f, set }) {
  const chips = [
    f.position && { key: "position", label: "Position", value: f.position, clear: () => set.position("") },
    f.gradYear && { key: "gradYear", label: "Class", value: f.gradYear, clear: () => set.gradYear("") },
    f.footballGrade && { key: "fb", label: "Football", value: f.footballGrade, clear: () => set.footballGrade("") },
    f.personalGrade && { key: "pg", label: "Personal", value: f.personalGrade, clear: () => set.personalGrade("") },
    f.school && { key: "school", label: "College", value: f.school.name, clear: () => set.school(null) },
    f.state && {
      key: "loc",
      label: "Location",
      value: f.city ? `${f.city}, ${f.state}` : f.state,
      clear: () => {
        set.city("");
        set.state("");
      },
    },
  ].filter(Boolean);

  if (chips.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-1.5" aria-label="Applied filters">
      {chips.map((c) => (
        <li key={c.key}>
          <button
            type="button"
            onClick={c.clear}
            aria-label={`Remove ${c.label} filter: ${c.value}`}
            className="group inline-flex h-6 items-center gap-1 rounded-md border border-white/80 bg-white/65 pl-2 pr-1 text-xs text-ink-600 backdrop-blur-md transition-colors hover:bg-white"
          >
            <span className="text-ink-500">{c.label}:</span>
            <span className="max-w-[140px] truncate font-semibold text-ink">{c.value}</span>
            <X className="h-3 w-3 text-ink-400 group-hover:text-ink" />
          </button>
        </li>
      ))}
    </ul>
  );
}
