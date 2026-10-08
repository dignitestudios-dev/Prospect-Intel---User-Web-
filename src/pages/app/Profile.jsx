import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileDown,
  GraduationCap,
  Heart,
  LifeBuoy,
  MapPin,
  MessageSquarePlus,
  Quote,
  Ruler,
  Users,
  Weight,
} from "lucide-react";
import { getAtheleteById } from "../../lib/query/queryFn";
import { formatDate, formatPhoneNumber, generateAthletePDF } from "../../lib/helpers";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { ProfileSkeleton } from "../../components/global/Skeleton";
import { useAppDispatch } from "../../lib/store/hook";
import { logActivity } from "../../lib/store/actions/activityActions";
import CollegeLogo from "../../ui/CollegeLogo";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import GradeStamp from "../../ui/GradeStamp";
import EmptyState from "../../ui/EmptyState";
import { TextArea } from "../../ui/Field";
import { GRADE_SCALE, gradeScore, parseGrade } from "../../ui/grades";
import { StatusTags } from "../../components/athletes/StatusTag";
import { cn } from "../../ui/cn";

const show = (v) => (v === undefined || v === null || v === "" ? "Not provided" : v);

const REQUEST_IDEAS = ["Updated film", "Latest grades", "Contact information", "Commitment status", "Injury update"];

const SECTIONS = [
  { id: "character", label: "Character" },
  { id: "athletic", label: "Athletic" },
  { id: "overview", label: "Strengths & weaknesses" },
  { id: "family", label: "Family" },
  { id: "grading", label: "Grading scale" },
];

/* ------------------------------- small pieces ------------------------------- */

function FactTile({ icon: Icon, label, children }) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal-700">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-ink-500">{label}</dt>
        <dd className="truncate text-sm font-semibold text-ink">{children}</dd>
      </div>
    </div>
  );
}

function Panel({ id, title, aside, children, className }) {
  return (
    <section id={id} className={cn("card scroll-mt-36", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-ink-900/10 px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {aside}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Fact({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-500">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/** Circular gauge: the arc fills with the grade, the letter sits in the middle. */
function GradeRing({ grade }) {
  const g = parseGrade(grade);
  const size = 92;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const score = gradeScore(grade);
  const [shown, setShown] = useState(0);

  // fill the arc after mount so it animates in
  useEffect(() => {
    const t = setTimeout(() => setShown(score), 60);
    return () => clearTimeout(t);
  }, [score]);

  const color = g.hex;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" role="img" aria-label={g.base ? `Grade ${grade}, ${g.name}` : "Not graded"}>
        <span className="flex items-start font-semibold leading-none tracking-tight" style={{ color: g.base ? color : undefined, fontSize: 30 }}>
          {g.base || "–"}
          {g.modifier && <span className="mt-0.5 text-base">{g.modifier === "-" ? "−" : g.modifier}</span>}
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-ink-500">PI Score</span>
      </div>
    </div>
  );
}

/** A to F scale with a pointer under the athlete's grade. */
function GradeScaleBar({ grade }) {
  const g = parseGrade(grade);
  return (
    <div aria-hidden="true">
      <div className="flex gap-1">
        {GRADE_SCALE.map((s) => {
          const active = g.base === s.letter;
          return (
            <div key={s.letter} className="flex-1">
              <div
                className="h-2 rounded-full transition-all"
                style={{ background: s.hex, opacity: active ? 1 : g.base ? 0.22 : 0.18 }}
              />
              <div className="mt-1.5 flex flex-col items-center">
                <span className={cn("text-[11px] font-semibold", active ? "text-ink" : "text-ink-400")}>{s.letter}</span>
                <span className={cn("mt-0.5 h-0 w-0 border-x-[4px] border-b-[5px] border-x-transparent", active ? "" : "border-b-transparent")} style={active ? { borderBottomColor: s.hex } : undefined} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CharacterColumn({ title, grade, description }) {
  const g = parseGrade(grade);
  return (
    <div className="flex min-w-0 flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">{title}</h3>
        {g.base && (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset"
            style={{ color: g.hex, background: g.hex + "14", boxShadow: "inset 0 0 0 1px " + g.hex + "40" }}
          >
            {grade}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <GradeRing grade={grade} />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-2xl font-semibold leading-tight text-ink">{g.base ? g.name : "Not graded yet"}</p>
          <p className="mt-1 text-[13px] leading-snug text-ink-500">
            {g.base ? g.meaning.split(". ")[0].replace(/\.$/, "") + "." : "The Prospect Intel team hasn't graded this area yet."}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <GradeScaleBar grade={grade} />
      </div>

      <div className="mt-5 border-t border-ink-900/10 pt-4">
        <h4 className="text-xs font-medium text-ink-500">Assessment</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
          {description ||
            (g.base ? "No written assessment has been added for this grade." : "Nothing has been written for this area yet.")}
        </p>
      </div>

      {g.base && (
        <p className="mt-4 rounded-lg bg-white/45 px-3.5 py-3 text-xs leading-relaxed text-ink-600 ring-1 ring-inset ring-white/80">
          <span className="font-semibold text-ink">What {g.base} means: </span>
          {g.meaning}
        </p>
      )}
    </div>
  );
}

function Person({ role, name, occupation, contact, dob }) {
  return (
    <div className="rounded-lg border border-white/80 bg-white/45 p-3.5">
      <p className="text-xs font-medium text-ink-500">{role}</p>
      <p className="mt-0.5 text-sm font-semibold text-ink">{show(name)}</p>
      <dl className="mt-2.5 space-y-1.5 text-[13px]">
        {[
          ["Occupation", occupation],
          ["Contact", contact ? formatPhoneNumber(contact) : ""],
          ["Date of birth", dob ? formatDate(dob) : ""],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <dt className="text-ink-500">{k}</dt>
            <dd className="text-right text-ink-700">{show(v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PointList({ items, tone }) {
  if (!items || items.length === 0) {
    return <p className="text-[13px] text-ink-500">Nothing has been added yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink-700">
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
              tone === "good" ? "bg-emerald-500/15 text-emerald-700" : "bg-red-500/15 text-red-700",
            )}
          >
            {tone === "good" ? "+" : "−"}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------- page ---------------------------------- */

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [saveLoading, setSaveLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const {
    data: athleteDetail,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["atheleteid", id],
    queryFn: () => getAtheleteById(id),
    enabled: !!id,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const b = athleteDetail?.basicInfo || {};
  const a = athleteDetail?.athlete || {};
  const fam = athleteDetail?.family || {};

  // Highlight the tab for the section being read.
  const loaded = Boolean(athleteDetail);
  useEffect(() => {
    if (!loaded) return undefined;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (els.length === 0 || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loaded, id]);

  // Previous / next within the list the user came from
  const list = location.state?.list || [];
  const index = list.findIndex((x) => x.id === id);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  const goTo = (target) => {
    if (!target) return;
    dispatch(
      logActivity({
        title: "Opened Player Profile",
        description: "Opened Player Profile",
        metaData: { type: "ProfileView", athleteImg: target.image, athleteName: target.name },
      }),
    );
    navigate(`/app/profile/${target.id}`, { state: { list } });
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/app/dashboard");
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await axiosinstance.post("/user/athlete/save", { athleteId: id });
      if (response?.status === 200) {
        SuccessToast(athleteDetail?.isSaved ? "Removed from Saved" : "Saved to your shortlist");
        queryClient.invalidateQueries({ queryKey: ["atheletesave"] });
        queryClient.invalidateQueries({ queryKey: ["athlete"] });
        refetch();
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.messsage || err?.response?.data?.message || "Couldn't update Saved. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const openRequest = () => {
    setMessageError("");
    setRequestOpen(true);
  };

  const handleRequestUpdate = async () => {
    if (message.trim().length < 3) {
      setMessageError("Tell the team what you'd like updated.");
      return;
    }
    setRequestLoading(true);
    try {
      const response = await axiosinstance.post("/user/athlete/request", {
        athleteId: id,
        description: message,
      });
      if (response?.status === 200) {
        SuccessToast(response?.data?.message || "Update request sent to the Prospect Intel team");
        setMessage("");
        setRequestOpen(false);
        dispatch(
          logActivity({
            title: "Requested Player Info",
            description: "Requested Player Info",
            metaData: {
              type: "RequestedPlayer",
              athleteImg: b?.image,
              athleteName: b?.name,
            },
          }),
        );
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message || "Couldn't send the request. Try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      await generateAthletePDF(athleteDetail, formatDate);
    } catch {
      ErrorToast("Couldn't create the PDF. Try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const addIdea = (idea) =>
    setMessage((m) => (m.trim() ? `${m.trim()}${/[.!?]$/.test(m.trim()) ? "" : ","} ${idea.toLowerCase()}` : idea));

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !athleteDetail) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="card">
          <EmptyState
            title="We couldn't load this athlete"
            action={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={goBack}>
                  Go back
                </Button>
                <Button variant="dark" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            }
          >
            Check your connection and try again. If it keeps happening, the profile may have been removed.
          </EmptyState>
        </div>
      </div>
    );
  }

  const saved = Boolean(athleteDetail?.isSaved);
  const siblings = Array.isArray(fam.siblings) ? fam.siblings : [];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6">
      {/* back and browse */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={goBack} className="-ml-2.5">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Button>
        {list.length > 1 && index >= 0 && (
          <div className="flex items-center gap-1.5" role="group" aria-label="Browse athletes">
            <Button variant="secondary" size="sm" onClick={() => goTo(prev)} disabled={!prev} aria-label={prev ? `Previous: ${prev.name}` : "No previous athlete"}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="px-1.5 text-xs tabular-nums text-ink-500">
              {index + 1} of {list.length}
            </span>
            <Button variant="secondary" size="sm" onClick={() => goTo(next)} disabled={!next} aria-label={next ? `Next: ${next.name}` : "No next athlete"}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* identity */}
      <header className="card overflow-hidden">
        <div className="px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4 sm:gap-5">
              <Avatar
                src={b.image}
                name={b.name}
                rounded="lg"
                className="!h-20 !w-20 shrink-0 !rounded-xl text-xl sm:!h-24 sm:!w-24"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-signal-700">
                  {[b.position, b.gradYear && `Class of ${b.gradYear}`].filter(Boolean).join("  ·  ") || "Athlete"}
                </p>
                <h1 className="mt-1 break-words text-2xl font-semibold leading-tight text-ink sm:text-[28px]" title={b.name}>
                  {b.name || "Unnamed athlete"}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-600">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                  {[b.schoolName, b.state].filter(Boolean).join(", ") || "School not provided"}
                </p>
                {Array.isArray(b.status) && b.status.length > 0 && (
                  <div className="mt-3">
                    <StatusTags tags={b.status} max={0} size="md" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button variant="primary" onClick={openRequest}>
                <MessageSquarePlus className="h-4 w-4" /> Request update
              </Button>
              <Button variant="secondary" onClick={handleSave} loading={saveLoading} aria-pressed={saved}>
                {!saveLoading && <Heart className={cn("h-4 w-4", saved && "fill-red-600 text-red-600")} />}
                {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="secondary" onClick={handleDownloadPDF} loading={pdfLoading}>
                {!pdfLoading && <FileDown className="h-4 w-4" />} Download PDF
              </Button>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 divide-ink-900/10 border-t border-ink-900/10 bg-white/35 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          <FactTile icon={Ruler} label="Height">
            {show(b.height)}
          </FactTile>
          <FactTile icon={Weight} label="Weight">
            {b.weight ? `${b.weight} lb` : "Not provided"}
          </FactTile>
          <FactTile icon={BookOpen} label="GPA">
            {show(b.gpa)}
          </FactTile>
          <FactTile icon={CalendarDays} label="Class">
            {show(b.gradYear)}
          </FactTile>
          <FactTile icon={MapPin} label="State">
            {show(b.state)}
          </FactTile>
          <div className="flex min-w-0 items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal-700">
              {b.committedCollege?.logo ? (
                <CollegeLogo src={b.committedCollege.logo} className="h-5 w-5" />
              ) : (
                <GraduationCap className="h-[18px] w-[18px]" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <dt className="text-xs text-ink-500">Committed</dt>
              <dd className="truncate text-sm font-semibold text-ink">{b.committedCollege?.name || "None yet"}</dd>
            </div>
          </div>
        </dl>
      </header>

      {/* section tabs + quick actions */}
      <nav
        aria-label="Profile sections"
        className="no-print glass sticky top-[64px] z-20 mt-5 flex items-center justify-between gap-3 overflow-x-auto rounded-xl px-2"
      >
        <ul className="flex gap-0.5">
          {SECTIONS.map((s) => {
            const active = activeSection === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(s.id);
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cn(
                    "relative block whitespace-nowrap px-3 py-3 text-[13px] font-medium transition-colors",
                    active ? "text-ink" : "text-ink-500 hover:text-ink",
                  )}
                >
                  {s.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t bg-signal" />}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <Button variant="ghost" size="icon-sm" onClick={handleSave} aria-label={saved ? "Remove from Saved" : "Save athlete"} title={saved ? "Saved" : "Save"}>
            <Heart className={cn("h-4 w-4", saved && "fill-red-600 text-red-600")} />
          </Button>
          <Button variant="primary" size="sm" onClick={openRequest}>
            Request update
          </Button>
        </div>
      </nav>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* main column */}
        <div className="min-w-0 space-y-5">
          <section id="character" className="card scroll-mt-36 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-ink-900/10 px-5 py-3.5 sm:px-6">
              <h2 className="text-sm font-semibold text-ink">Character assessment</h2>
              <span className="text-xs text-ink-500">Graded A to F</span>
            </div>
            <div className="grid md:grid-cols-2 md:divide-x md:divide-ink-900/10">
              <CharacterColumn title="Football character" grade={a.footballPiScore} description={a.footballDescription} />
              <div className="border-t border-ink-900/10 md:border-t-0">
                <CharacterColumn title="Personal character" grade={a.personalPiScore} description={a.personalDescription} />
              </div>
            </div>
          </section>

          <Panel id="athletic" title="Athletic background">
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Fact label="Other sports">{show(a.otherSports)}</Fact>
              <Fact label="Activities">{show(a.activities)}</Fact>
              <Fact label="Coach evaluation">{show(a.coachEvaluation)}</Fact>
              <Fact label="Other relevant information">{show(a.otherInfo)}</Fact>
            </dl>
          </Panel>

          <div id="overview" className="grid scroll-mt-36 gap-5 md:grid-cols-2">
            <Panel title="Strengths">
              <PointList items={athleteDetail?.overview?.strengths} tone="good" />
            </Panel>
            <Panel title="Weaknesses">
              <PointList items={athleteDetail?.overview?.weaknesses} tone="bad" />
            </Panel>
          </div>

          <Panel
            id="grading"
            title="How character grades work"
            aside={<span className="text-xs text-ink-500">Strongest to weakest</span>}
          >
            <ul className="divide-y divide-ink-900/10">
              {GRADE_SCALE.map((g) => {
                const marks = [
                  parseGrade(a.footballPiScore).base === g.letter && "football",
                  parseGrade(a.personalPiScore).base === g.letter && "personal",
                ].filter(Boolean);
                return (
                  <li key={g.letter} className="flex items-start gap-4 py-3.5 first:pt-0 last:pb-0">
                    <GradeStamp grade={g.letter} size="lg" className="mt-0.5 min-w-11" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3 className="text-sm font-semibold text-ink">{g.name}</h3>
                        {marks.length > 0 && (
                          <span className="text-xs text-ink-500">· this athlete&apos;s {marks.join(" and ")} grade</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ink-500">{g.meaning}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-ink-500">Plus (+) and minus (−) refine a grade within its letter.</p>
          </Panel>
        </div>

        {/* side column */}
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-[132px] lg:self-start">
          <Panel
            id="family"
            title="Family"
            aside={<Users className="h-4 w-4 text-ink-400" aria-hidden="true" />}
          >
            <div className="space-y-3">
              <Person role="Mother" name={fam.motherName} occupation={fam.motherOccupation} contact={fam.motherContact} dob={fam.motherDob} />
              <Person role="Father" name={fam.fatherName} occupation={fam.fatherOccupation} contact={fam.fatherContact} dob={fam.fatherDob} />
            </div>

            <h3 className="mb-2 mt-5 text-xs font-medium text-ink-500">Siblings</h3>
            {siblings.length === 0 ? (
              <p className="text-[13px] text-ink-500">No siblings listed.</p>
            ) : (
              <ul className="divide-y divide-ink-900/10 rounded-lg border border-white/80 bg-white/45">
                {siblings.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13px]">
                    <span className="min-w-0 truncate">
                      <span className="font-semibold text-ink">{show(s?.name)}</span>
                      <span className="ml-2 text-ink-500">{s?.type}</span>
                    </span>
                    <span className="shrink-0 text-ink-500">{s?.dob ? formatDate(s.dob) : ""}</span>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mb-2 mt-5 text-xs font-medium text-ink-500">Key influences</h3>
            <figure className="rounded-lg border border-white/80 bg-white/45 p-3.5">
              <Quote className="mb-1.5 h-4 w-4 text-signal" aria-hidden="true" />
              <blockquote className="text-[13px] leading-relaxed text-ink-700">{show(fam.keyInfluences)}</blockquote>
            </figure>
          </Panel>

          <div className="card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal/10 text-signal-700">
              <LifeBuoy className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-ink">Missing something?</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
              Ask the Prospect Intel team for updated film, grades or contact details on {b.name || "this athlete"}.
            </p>
            <Button variant="secondary" onClick={openRequest} className="mt-3.5 w-full justify-center">
              <MessageSquarePlus className="h-4 w-4" /> Request an update
            </Button>
          </div>
        </aside>
      </div>

      {/* request an update */}
      <Dialog
        open={requestOpen}
        onClose={() => !requestLoading && setRequestOpen(false)}
        title="Request an update"
        description={`Tell the Prospect Intel team what you'd like to know about ${b.name || "this athlete"}.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRequestOpen(false)} disabled={requestLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRequestUpdate} loading={requestLoading}>
              Send request
            </Button>
          </>
        }
      >
        <div className="mb-3 flex flex-wrap gap-1.5" aria-label="Quick suggestions">
          {REQUEST_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => addIdea(idea)}
              className="rounded-md border border-white/90 bg-white/70 px-2.5 py-1 text-xs font-medium text-ink-600 transition-colors hover:border-signal hover:bg-signal/10 hover:text-signal-700"
            >
              + {idea}
            </button>
          ))}
        </div>
        <TextArea
          data-autofocus
          label="Your message"
          value={message}
          maxLength={500}
          onChange={(e) => {
            setMessage(e.target.value);
            if (messageError) setMessageError("");
          }}
          placeholder="For example: Do you have updated film from this season?"
          error={messageError}
          hint="The more specific you are, the faster the team can find it."
        />
      </Dialog>
    </div>
  );
};

export default Profile;
