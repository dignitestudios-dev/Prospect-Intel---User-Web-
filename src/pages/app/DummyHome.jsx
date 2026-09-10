import { useEffect, useState, useRef } from "react";
import { FaPrint, FaDownload, FaSearch } from "react-icons/fa";
import ArchivedTable from "../../components/ArchivedTable";
import { textOne, textThree, textTwo } from "../../assets/export";
import ActiveFilters from "../../components/home/ActiveFilters";
import { getAthlete, getSchool } from "../../lib/query/queryFn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import citiesData from "../../static/us";
import { logActivity } from "../../lib/store/actions/activityActions";
import useDebounce, { useAppDispatch, useAppSelector } from "../../lib/store/hook";
import { setFilters, resetFilters } from "../../lib/store/feature/filterSlice";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import axiosinstance from "../../axios";
import { RefreshCcw, Heart, X } from "lucide-react";

const positions = [
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

const gradYearPills = [
  { label: "2027" },
  { label: "2028" },
  { label: "2029" },
  { label: "2030" },
  { label: "2031" },
  { label: "2032" },
];

const personalCharacters = [
  { label: "A" },

  { label: "B" },

  { label: "C" },

  { label: "D" },

  { label: "F" },

  { label: "N/A" },
];

const footballCharacters = [
  { label: "A" },

  { label: "B" },

  { label: "C" },

  { label: "D" },

  { label: "F" },

  { label: "N/A" },
];
export const locationData = {
  Colorado: ["Denver", "Boulder", "Aurora"],
  Texas: ["Houston", "Dallas", "Austin"],
};
const DummyHome = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const savedFilters = useAppSelector((state) => state.filters);

  const [page, setPage] = useState(savedFilters?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(savedFilters?.itemsPerPage || 10);
  const [schoolPage, setSchoolPage] = useState(savedFilters?.schoolPage || 1);
  const [search, setSearch] = useState(savedFilters?.search || "");
  const [isArchived, setIsArchived] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(savedFilters?.selectedPosition || "");
  const [personalPiScore, setPersonalPiScore] = useState(savedFilters?.personalPiScore || "");
  const [footballPiScore, setFootBallPiScore] = useState(savedFilters?.footballPiScore || "");
  const [selectedSchool, setSelectedSchool] = useState(savedFilters?.selectedSchool || null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(savedFilters?.selectedState || "");
  const [selectedCity, setSelectedCity] = useState(savedFilters?.selectedCity || "");
  const [cities, setCities] = useState(
    savedFilters?.selectedState ? citiesData[savedFilters.selectedState] || [] : []
  );
  const [selectedGradeYear, setSelectedGradeYear] = useState(savedFilters?.selectedGradeYear || "");
  const SchoolId = selectedSchool?.id || "";
  const [status, setStatus] = useState(savedFilters?.status ?? "active");
  const isActive =
    status === "active" ? true : status === "inactive" ? false : "";
  const debouncedSearch = useDebounce(search, 500);
  const [selectedIds, setSelectedIds] = useState([]);
  const [csvExportLoading, setCsvExportLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(savedFilters?.searchTerm || "");
  const [sortByName, setSortByName] = useState(savedFilters?.sortByName || false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [sortBy, setSortBy] = useState(savedFilters?.sortBy || "");
  const [sortOrder, setSortOrder] = useState(savedFilters?.sortOrder || "asc");
  const [bulkLoading, setBulkLoading] = useState(false);

  const isFirstMount = useRef(true);
  const isStateMount = useRef(true);

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
      })
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

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else {
        // 3rd click resets sorting
        setSortBy("");
        setSortOrder("asc");
      }
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleBulkSave = async () => {
    if (!selectedIds || selectedIds.length === 0) {
      ErrorToast("Please select at least one athlete");
      return;
    }
    setBulkLoading(true);
    try {
      const res = await axiosinstance.post("/user/athlete/save/bulk", {
        athleteIds: selectedIds,
        action: "save",
      });
      if (res.status === 200 || res.status === 201) {
        SuccessToast(res.data?.message || "Athletes saved successfully!");
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: ["athlete"] });
        queryClient.invalidateQueries({ queryKey: ["atheletesave"] });
      }
    } catch (err) {
      ErrorToast(
        err?.response?.data?.message ||
        err?.response?.data?.messsage ||
        "Failed to save athletes"
      );
    } finally {
      setBulkLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setPage(1);
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

    const appliedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v),
    );

    if (Object.keys(appliedFilters).length > 0) {
      dispatch(
        logActivity({
          title: "Filter Applied",
          description: "User applied filters",
          metaData: {
            type: "Filters",
            filter: appliedFilters,
          },
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
  ]);

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

  useEffect(() => {
    if (selectedState) {
      setCities(citiesData[selectedState] || []);
    } else {
      setCities([]);
    }
    if (isStateMount.current) {
      isStateMount.current = false;
      return;
    }
    setSelectedCity("");
  }, [selectedState]);

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
        a.download = "athlete_templates.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        SuccessToast("Template downloaded");
        setSelectedIds([]);
      }
    } catch (error) {
      ErrorToast(error?.response?.data?.message);
    } finally {
      setCsvExportLoading(false);
    }
  };

  const handleReferesh = () => {
    queryClient.invalidateQueries({
      queryKey: ["athlete"],
    });
  };

  return (
    <div className="w-full min-h-screen h-full bg-[#F5F7FB] flex justify-center items-start font-sans ">
      <div className="w-full h-full bg-[#EAEEF8] border-2 border-gray-100 mb-2 overflow-auto">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Header Content */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-[380px]">
              <FaSearch className="absolute shadow-xl left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="text"
                placeholder="Search for players"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full font-thin h-[50px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 text-sm shadow-sm"
              />
            </div>
            {/* <div className="hidden sm:block">
              <p className="cursor-pointer text-[#0085CA] font-medium">
                Advanced Filters
              </p>
            </div> */}
          </div>

          {/* Right Side Header Buttons and Account */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 w-full sm:w-auto">
            <button
              onClick={handleReferesh}
              disabled={isFetching}
              className={`flex items-center px-4 py-2 border border-white bg-[#EAEEF8] text-gray-700 rounded-lg text-sm shadow shadow-blue-200 transition-colors
    ${isFetching ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"}
  `}
            >
              <RefreshCcw className="mr-2" size={16} />

              <span>{isFetching ? "Syncing..." : "Sync"}</span>
            </button>
            {!isArchived && (
              <div className="flex items-center space-x-3">
                {/* <button className="flex items-center px-4 py-2 border border-white bg-[#EAEEF8] rounded-lg text-gray-700 text-sm shadow-sm hover:bg-gray-50 transition-colors">
                  <FaPrint className="mr-2 text-xs" />
                  Print
                </button> */}
                <button
                  onClick={handleCSVExport}
                  className="flex items-center px-4 py-2 border border-white bg-[#EAEEF8] text-gray-700 rounded-lg text-sm shadow shadow-blue-200 hover:bg-gray-50 transition-colors"
                >
                  <FaDownload className="mr-2 text-xs" />
                  <span>
                    {csvExportLoading ? "Exporting..." : "Export CSV"}
                  </span>
                </button>
              </div>
            )}

            {/* RIGHT SIDE: Active / Archived Toggle */}
            <div className="flex items-center">
              <div className="flex border border-white bg-[#EAEEF8] rounded-lg overflow-hidden shadow-sm p-1">
                {/* Active */}
                <button
                  className={`px-6 sm:px-10 py-2 rounded-lg text-sm font-medium ${status === "active"
                    ? "bg-white border-2 border-gray-300 text-black"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    setStatus("active");

                    queryClient.invalidateQueries({
                      queryKey: ["athlete"],
                    });
                  }}
                >
                  Active
                </button>

                {/* Archived */}
                <button
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium ${status === "inactive"
                    ? "bg-white border-2 border-gray-300 text-black"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    setStatus("inactive");

                    queryClient.invalidateQueries({
                      queryKey: ["athlete"],
                    });
                  }}
                >
                  Archived
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Table and Filters */}
        <div className="flex flex-col xl:flex-row">
          {/* Left Side: Table & Results */}
          <div className="flex-grow min-w-0 p-6 pt-4 border-2 border-r-0 xl:border-r border-gray-100 w-full xl:max-w-[calc(100%-300px)]">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {data?.data?.length || 0} Results
                </h3>
                {sortBy && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
                    <span>
                      Sorted: <strong>{sortBy}</strong> ({sortOrder.toUpperCase()})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy("");
                        setSortOrder("asc");
                        setPage(1);
                      }}
                      className="hover:bg-blue-200 rounded p-0.5 transition-colors cursor-pointer text-blue-700"
                      title="Clear sorting"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleBulkSave}
                disabled={bulkLoading || selectedIds.length === 0}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm border ${
                  selectedIds.length > 0
                    ? "bg-[#0085CA] hover:bg-blue-600 text-white border-transparent shadow-blue-300 cursor-pointer"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 opacity-80 cursor-not-allowed"
                }`}
                title={
                  selectedIds.length > 0
                    ? `Save ${selectedIds.length} selected athlete(s)`
                    : "Select athletes using checkboxes to Mass Favorite"
                }
              >
                <Heart
                  size={17}
                  className={
                    selectedIds.length > 0
                      ? "fill-white text-white"
                      : "text-red-500 fill-red-100"
                  }
                />
                <span className={selectedIds.length > 0 ? "text-white" : "text-gray-700"}>
                  {bulkLoading
                    ? "Saving..."
                    : selectedIds.length > 0
                    ? `Mass Favorite (${selectedIds.length})`
                    : "Mass Favorite"}
                </span>
              </button>
            </div>

            <ArchivedTable
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              players={data?.data}
              pagination={data?.pagination}
              loading={isLoading}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>

          <ActiveFilters
            positionPills={positions}
            personalCharacters={personalCharacters}
            footballCharacters={footballCharacters}
            gradYearPills={gradYearPills}
            textOne={textOne}
            textTwo={textTwo}
            textThree={textThree}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            setPersonalPiScore={setPersonalPiScore}
            setFootBallPiScore={setFootBallPiScore}
            schools={schools}
            setSelectedSchool={setSelectedSchool}
            selectedSchool={selectedSchool}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setSchoolPage={setSchoolPage}
            schoolLoading={schoolLoading}
            handleClearAll={handleClearAll}
            setSelectedGradeYear={setSelectedGradeYear}
            selectedGradeYear={selectedGradeYear}
            cities={cities}
            selectedCity={selectedCity}
            setSelectedState={setSelectedState}
            selectedState={selectedState}
            setSelectedCity={setSelectedCity}
            personalPiScore={personalPiScore}
            footballPiScore={footballPiScore}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSortByName={setSortByName}
            sortByName={sortByName}
          />

          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default DummyHome;
