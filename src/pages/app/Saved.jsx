import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, HeartOff, RefreshCw, SearchX } from "lucide-react";
import useDebounce from "../../lib/store/hook";
import { getAtheleteSave } from "../../lib/query/queryFn";
import Pagination from "../../components/global/Pagination";
import AthleteResults from "../../components/athletes/AthleteResults";
import { useBulkSave, useOpenAthlete, useToggleSave } from "../../components/athletes/hooks";
import { SearchInput, SelectionBar, SortMenu, ViewToggle } from "../../components/athletes/Toolbar";
import Button from "../../ui/Button";
import EmptyState from "../../ui/EmptyState";

const VIEW_KEY = "pi_athlete_view";
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === "cards" ? "cards" : "table";
  } catch {
    return "table";
  }
};

const Saved = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [view, setViewState] = useState(readView);

  const setView = (v) => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["atheletesave", page, itemsPerPage, debouncedSearch, sortBy, sortOrder],
    queryFn: () =>
      getAtheleteSave({
        page,
        itemsPerPage,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const athleteList = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages =
    data?.pagination?.totalPages || Math.ceil((athleteList?.length || 0) / itemsPerPage) || 1;

  const totalResults = data?.pagination?.total ?? data?.pagination?.totalCount ?? athleteList?.length ?? 0;

  // Server-paged responses are used as-is; a plain array is paged here.
  const displayData = useMemo(() => {
    if (data?.pagination) return athleteList;
    const start = (page - 1) * itemsPerPage;
    return athleteList.slice(start, start + itemsPerPage);
  }, [data?.pagination, athleteList, page, itemsPerPage]);

  const openAthlete = useOpenAthlete(displayData);
  const { toggle: toggleSave, savingId } = useToggleSave();
  const { run: bulkRun, bulkLoading } = useBulkSave({ onDone: () => setSelectedIds([]) });

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        setSortBy("");
        setSortOrder("asc");
      }
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [debouncedSearch]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, itemsPerPage]);

  const emptyState = debouncedSearch ? (
    <EmptyState
      icon={SearchX}
      title="No saved athletes match"
      action={
        <Button variant="dark" onClick={() => setSearch("")}>
          Clear search
        </Button>
      }
    >
      Check the spelling, or search by a different name.
    </EmptyState>
  ) : (
    <EmptyState
      icon={HeartOff}
      title="Nothing saved yet"
      action={
        <Link
          to="/app/dashboard"
          className="inline-flex h-9 items-center rounded-md bg-ink px-3.5 text-sm font-medium text-white hover:bg-ink-800"
        >
          Discover athletes
        </Link>
      }
    >
      Tap the heart on any athlete to keep them here for later.
    </EmptyState>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Saved athletes</h1>
          <p className="mt-0.5 text-[13px] text-ink-500">Your shortlist, kept for later review.</p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Refresh saved athletes"
          title="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="mt-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search saved athletes" className="max-w-md" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[13px] font-medium text-ink-600" aria-live="polite">
          {isLoading ? "Loading saved athletes" : `${totalResults.toLocaleString()} saved`}
        </h2>
        <div className="flex items-center gap-2">
          <SortMenu
            sortBy={sortBy}
            sortOrder={sortOrder}
            onChange={(v) => {
              setSortBy(v);
              setSortOrder("asc");
              setPage(1);
            }}
            onToggleOrder={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
          />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      <div className="mt-2">
        <AthleteResults
          athletes={displayData}
          loading={isLoading}
          view={view}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onOpen={openAthlete}
          onToggleSave={(id) => toggleSave(id, { wasSaved: true })}
          savingId={savingId}
          forceSaved
          emptyState={emptyState}
        />
        {!isLoading && displayData.length > 0 && (
          <Pagination
            pagination={{ currentPage: page, totalPages }}
            onPageChange={(n) => setPage(n)}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(v) => {
              setItemsPerPage(v);
              setPage(1);
            }}
            itemsPerPageOptions={[10, 25, 50, 100]}
          />
        )}
      </div>

      <SelectionBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
        <Button variant="danger" size="sm" loading={bulkLoading} onClick={() => bulkRun(selectedIds, "unsave")}>
          {!bulkLoading && <Heart className="h-4 w-4" />}
          Remove from Saved
        </Button>
      </SelectionBar>
    </div>
  );
};

export default Saved;
