import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Heart, RefreshCw, SearchX, Users } from "lucide-react";
import { getAthlete, getSchool } from "../../lib/query/queryFn";
import { logActivity } from "../../lib/store/actions/activityActions";
import useDebounce, { useAppDispatch, useAppSelector } from "../../lib/store/hook";
import { setFilters, resetFilters } from "../../lib/store/feature/filterSlice";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import Pagination from "../../components/global/Pagination";
import axiosinstance from "../../axios";
import AthleteResults from "../../components/athletes/AthleteResults";
import { useBulkSave, useOpenAthlete, useToggleSave } from "../../components/athletes/hooks";
import { AppliedChips, FilterBar } from "../../components/athletes/DiscoverFilters";
import { SearchInput, SelectionBar, SortMenu, ViewToggle } from "../../components/athletes/Toolbar";
import Button from "../../ui/Button";
import Segmented from "../../ui/Segmented";
import EmptyState from "../../ui/EmptyState";

const VIEW_KEY = "pi_athlete_view";
const readView = () => {
  try {
    return localStorage.getItem(VIEW_KEY) === "cards" ? "cards" : "table";
  } catch {
    return "table";
  }
};

const todayStamp = () => new Date().toISOString().slice(0, 10);

const DummyHome = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const savedFilters = useAppSelector((state) => state.filters);

  // ---- filter / paging state (restored from the session, same shape as before) ----
  const [page, setPage] = useState(savedFilters?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(savedFilters?.itemsPerPage || 10);
  const [schoolPage, setSchoolPage] = useState(savedFilters?.schoolPage || 1);
  const [search, setSearch] = useState(savedFilters?.search || "");
  const [selectedPosition, setSelectedPosition] = useState(savedFilters?.selectedPosition || "");
  const [personalPiScore, setPersonalPiScore] = useState(savedFilters?.personalPiScore || "");
  const [footballPiScore, setFootBallPiScore] = useState(savedFilters?.footballPiScore || "");
  const [selectedSchool, setSelectedSchool] = useState(savedFilters?.selectedSchool || null);
  const [selectedState, setSelectedState] = useState(savedFilters?.selectedState || "");
  const [selectedCity, setSelectedCity] = useState(savedFilters?.selectedCity || "");
  const [selectedGradeYear, setSelectedGradeYear] = useState(savedFilters?.selectedGradeYear || "");
  const [status, setStatus] = useState(savedFilters?.status ?? "active");
  const [searchTerm, setSearchTerm] = useState(savedFilters?.searchTerm || "");
  const [sortByName, setSortByName] = useState(savedFilters?.sortByName || false);
  const [sortBy, setSortBy] = useState(savedFilters?.sortBy || "");
  const [sortOrder, setSortOrder] = useState(savedFilters?.sortOrder || "asc");

  // ---- screen-only state ----
  const [view, setViewState] = useState(readView);
  const [selectedIds, setSelectedIds] = useState([]);
  const [csvExportLoading, setCsvExportLoading] = useState(false);

  const SchoolId = selectedSchool?.id || "";
  const isActive = status === "active" ? true : status === "inactive" ? false : "";
  const debouncedSearch = useDebounce(search, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isFirstMount = useRef(true);

  const setView = (v) => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* private mode: the choice just won't persist */
    }
  };

  // Keep filters saved in Redux and sessionStorage
  useEffect(() => {
    dispatch(
      setFilters({
        page,
        itemsPerPage,
        schoolPage,
        search,
        selectedPosition,
        personalPiScore,
        footballPiScore,
        selectedSchool,
        selectedGradeYear,
        selectedState,
        selectedCity,
        status,
        searchTerm,
        sortByName,
        sortBy,
        sortOrder,
      }),
    );
  }, [
    page,
    itemsPerPage,
    schoolPage,
    search,
    selectedPosition,
    personalPiScore,
    footballPiScore,
    selectedSchool,
    selectedGradeYear,
    selectedState,
    selectedCity,
    status,
    searchTerm,
    sortByName,
    sortBy,
    sortOrder,
    dispatch,
  ]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "athlete",
      page,
      itemsPerPage,
      debouncedSearch,
      selectedPosition,
      personalPiScore,
      footballPiScore,
      SchoolId,
      selectedGradeYear,
      status,
      selectedCity,
      selectedState,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      getAthlete({
        page,
        itemsPerPage,
        search: debouncedSearch,
        selectedPosition,
        personalPiScore,
        footballPiScore,
        SchoolId,
        selectedGradeYear,
        isActive,
        selectedCity,
        selectedState,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const { data: schools, isLoading: schoolLoading } = useQuery({
    queryKey: ["school", schoolPage, debouncedSearchTerm, sortByName],
    queryFn: () =>
      getSchool({
        schoolPage,
        searchTerm: debouncedSearchTerm,
        sort: sortByName,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  // A changed filter returns to page 1 and logs which filters were applied.
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setPage(1);
    setSelectedIds([]);
    const filters = {
      search,
      position: selectedPosition,
      personalPiScore,
      footballPiScore: footballPiScore?.label || footballPiScore,
      school: selectedSchool?.name || "",
      gradYear: selectedGradeYear,
      state: selectedState,
      city: selectedCity,
      status,
    };
    const appliedFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    if (Object.keys(appliedFilters).length > 0) {
      dispatch(
        logActivity({
          title: "Filter Applied",
          description: "User applied filters",
          metaData: { type: "Filters", filter: appliedFilters },
        }),
      );
    }
  }, [
    search,
    selectedPosition,
    personalPiScore,
    footballPiScore,
    selectedSchool,
    selectedGradeYear,
    selectedState,
    selectedCity,
    status,
    dispatch,
  ]);

  // Selection belongs to one page of results.
  useEffect(() => {
    setSelectedIds([]);
  }, [page, itemsPerPage]);

  const athletes = data?.data || [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? pagination?.totalCount ?? athletes.length;

  const openAthlete = useOpenAthlete(athletes);
  const { toggle: toggleSave, savingId } = useToggleSave();
  const { run: bulkRun, bulkLoading } = useBulkSave({ onDone: () => setSelectedIds([]) });

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        // third click clears the sort
        setSortBy("");
        setSortOrder("asc");
      }
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleClearAll = () => {
    setSelectedPosition("");
    setPersonalPiScore("");
    setFootBallPiScore("");
    setSelectedGradeYear("");
    setSelectedCity("");
    setSelectedState("");
    setSelectedSchool(null);
    setSchoolPage(1);
    setSearch("");
    setStatus("active");
    setPage(1);
    setItemsPerPage(10);
    setSearchTerm("");
    setSortByName(false);
    setSortBy("");
    setSortOrder("asc");
    dispatch(resetFilters());
  };

  const handleCSVExport = async () => {
    setCsvExportLoading(true);
    try {
      const response = await axiosinstance.post("/athlete/export/csv", {
        athletes: selectedIds,
        ...(status === "active" && { isActive: true }),
        ...(status === "inactive" && { isActive: false }),
      });
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `athletes-${todayStamp()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        SuccessToast("Export ready. Your CSV is downloading.");
        setSelectedIds([]);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message || "Export failed. Try again.");
    } finally {
      setCsvExportLoading(false);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["athlete"] });
  };

  // What the filter bar reads and writes
  const f = {
    position: selectedPosition,
    gradYear: selectedGradeYear,
    footballGrade: footballPiScore,
    personalGrade: personalPiScore,
    school: selectedSchool,
    state: selectedState,
    city: selectedCity,
  };
  const set = {
    position: setSelectedPosition,
    gradYear: setSelectedGradeYear,
    footballGrade: setFootBallPiScore,
    personalGrade: setPersonalPiScore,
    school: setSelectedSchool,
    state: (v) => {
      setSelectedState(v);
      setSelectedCity("");
    },
    city: setSelectedCity,
  };

  const activeCount = [
    selectedPosition,
    selectedGradeYear,
    footballPiScore,
    personalPiScore,
    selectedSchool,
    selectedState,
  ].filter(Boolean).length;
  const hasQuery = activeCount > 0 || Boolean(search);

  const emptyState = hasQuery ? (
    <EmptyState
      icon={SearchX}
      title="No athletes match"
      action={
        <Button variant="dark" onClick={handleClearAll}>
          Clear search and filters
        </Button>
      }
    >
      Try a different name, or remove a filter to widen the list.
    </EmptyState>
  ) : (
    <EmptyState icon={Users} title={status === "inactive" ? "No archived athletes" : "No athletes yet"}>
      {status === "inactive"
        ? "Archived athletes will appear here."
        : "New athletes appear here as the Prospect Intel team adds them."}
    </EmptyState>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-6 sm:px-6">
      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Athletes</h1>
          <p className="mt-0.5 text-[13px] text-ink-500">Search, filter and review prospect profiles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            label="Athlete status"
            value={status}
            onChange={(v) => setStatus(v)}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Archived" },
            ]}
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
            aria-label="Refresh results"
            title="Refresh results"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="secondary" onClick={handleCSVExport} loading={csvExportLoading}>
            {!csvExportLoading && <Download className="h-4 w-4" />}
            {selectedIds.length > 0 ? `Export selected (${selectedIds.length})` : "Export all"}
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mt-5 flex flex-wrap items-start gap-2">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by athlete name" className="w-full md:w-72" />
        <FilterBar
          f={f}
          set={set}
          schools={schools}
          schoolsLoading={schoolLoading}
          schoolSearch={searchTerm}
          setSchoolSearch={setSearchTerm}
          activeCount={activeCount}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Results header */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-8 flex-wrap items-center gap-3">
          <h2 className="text-[13px] font-medium text-ink-600" aria-live="polite">
            {isLoading ? "Loading athletes" : `${total.toLocaleString()} ${total === 1 ? "athlete" : "athletes"}`}
          </h2>
          <AppliedChips f={f} set={set} />
        </div>
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
          athletes={athletes}
          loading={isLoading}
          view={view}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onOpen={openAthlete}
          onToggleSave={(id, wasSaved) => toggleSave(id, { wasSaved })}
          savingId={savingId}
          emptyState={emptyState}
        />
        {!isLoading && athletes.length > 0 && (
          <Pagination
            pagination={pagination || { currentPage: 1, totalPages: 1 }}
            onPageChange={(n) => {
              if (n >= 1 && n <= (pagination?.totalPages || 1)) setPage(n);
            }}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setPage(1);
            }}
            itemsPerPageOptions={[10, 25, 50, 100]}
          />
        )}
      </div>

      <SelectionBar count={selectedIds.length} onClear={() => setSelectedIds([])}>
        <Button variant="primary" size="sm" loading={bulkLoading} onClick={() => bulkRun(selectedIds, "save")}>
          {!bulkLoading && <Heart className="h-4 w-4" />}
          Save
        </Button>
        <Button variant="onDark" size="sm" loading={csvExportLoading} onClick={handleCSVExport}>
          {!csvExportLoading && <Download className="h-4 w-4" />}
          Export
        </Button>
      </SelectionBar>
    </div>
  );
};

export default DummyHome;
