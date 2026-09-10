import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { RefreshCcw, X, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import useDebounce, { useAppDispatch } from "../../lib/store/hook";
import { logActivity } from "../../lib/store/actions/activityActions";
import { getAtheleteSave } from "../../lib/query/queryFn";
import { TableSkeleton } from "../../components/global/Skeleton";
import Pagination from "../../components/global/Pagination";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { Emptyimg } from "../../assets/export";

const Saved = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [removeLoading, setRemoveLoading] = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      "atheletesave",
      page,
      itemsPerPage,
      debouncedSearch,
      sortBy,
      sortOrder,
    ],
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

  const getGradeColor = (score) => {
    const grade = score?.charAt(0)?.toUpperCase();

    const colorMap = {
      A: "bg-[#0B3D2E]",
      B: "bg-[#1DB863]",
      C: "bg-[#F4D35E]",
      D: "bg-[#FFB805] text-black",
      F: "bg-[#FF3A3A]",
    };

    return colorMap[grade] || "bg-gray-400";
  };

  const handleAthleteClick = (p) => {
    if (!p?._id) return;
    dispatch(
      logActivity({
        title: "Opened Player Profile",
        description: "Opened Player Profile",
        metaData: {
          type: "ProfileView",
          athleteImg: p.basicInfo?.image,
          athleteName: p?.basicInfo?.name,
        },
      }),
    );
    queryClient.invalidateQueries(["athlete", p?._id]);
    navigate(`/app/profile/${p?._id}`);
  };

  const handleSave = async (id) => {
    setRemoveLoading(id);
    try {
      const response = await axiosinstance.post("/user/athlete/save", {
        athleteId: id,
      });
      if (response?.status === 200 || response?.status === 201) {
        SuccessToast(response?.data?.message || "Removed Successfully");
        queryClient.invalidateQueries({ queryKey: ["atheletesave"] });
        queryClient.invalidateQueries({ queryKey: ["athlete"] });
      }
    } catch (err) {
      ErrorToast(
        err?.response?.data?.message ||
        err?.response?.data?.messsage ||
        "Failed to remove athlete"
      );
    } finally {
      setRemoveLoading(null);
    }
  };

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

  const handleClearSort = () => {
    setSortBy("");
    setSortOrder("asc");
    setPage(1);
  };

  const SortHeader = ({ label, sortKey, className = "" }) => {
    const isSorted = sortBy === sortKey;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleSort(sortKey);
        }}
        className={`inline-flex items-center gap-1 cursor-pointer select-none transition-colors group max-w-full ${className}`}
        title={`Sort by ${label}`}
      >
        <span
          className={`font-bold text-[12px] xl:text-[13px] tracking-wide transition-colors truncate ${
            isSorted ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"
          }`}
        >
          {label}
        </span>
        <span
          className={`flex items-center justify-center flex-shrink-0 transition-colors ${
            isSorted
              ? "text-blue-600 bg-blue-100 rounded px-0.5 py-0.5"
              : "text-gray-400 group-hover:text-blue-500"
          }`}
        >
          {isSorted ? (
            sortOrder === "asc" ? (
              <ChevronUp size={13} className="stroke-[2.5]" />
            ) : (
              <ChevronDown size={13} className="stroke-[2.5]" />
            )
          ) : (
            <ArrowUpDown size={11} className="opacity-50 group-hover:opacity-100" />
          )}
        </span>
      </div>
    );
  };

  const athleteList = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const totalPages =
    data?.pagination?.totalPages ||
    Math.ceil((athleteList?.length || 0) / itemsPerPage) ||
    1;

  const totalResults =
    data?.pagination?.total ??
    data?.pagination?.totalCount ??
    athleteList?.length ??
    0;

  const displayData = useMemo(() => {
    if (data?.pagination) {
      return athleteList;
    }
    const start = (page - 1) * itemsPerPage;
    return athleteList.slice(start, start + itemsPerPage);
  }, [data?.pagination, athleteList, page, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="w-full min-h-screen h-full bg-[#F5F7FB] flex justify-center items-start font-sans">
      <div className="w-full h-full bg-[#EAEEF8] border-2 border-gray-100 mb-2 overflow-auto">
        {/* Top Header Bar consistent with Home */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/app/dashboard");
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white text-gray-700 hover:text-black rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all font-medium text-xs cursor-pointer flex-shrink-0"
              title="Back"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back</span>
            </button> */}
            <div className="relative w-full sm:w-[380px]">
              <FaSearch className="absolute shadow-xl left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="text"
                placeholder="Search saved players"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full font-thin h-[50px] pl-10 pr-10 py-2.5 rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 text-sm shadow-sm"
              />
              {/* {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )} */}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className={`flex items-center px-4 py-2 border border-white bg-[#EAEEF8] text-gray-700 rounded-lg text-sm shadow shadow-blue-200 transition-colors ${
                isFetching ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              <RefreshCcw className="mr-2" size={16} />
              <span>{isFetching ? "Syncing..." : "Sync"}</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 pt-4 border-t-2 border-gray-100 w-full">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-800">
                {totalResults} Results
              </h3>
              {sortBy && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium">
                  <span>
                    Sorted: <strong>{sortBy}</strong> ({sortOrder.toUpperCase()})
                  </span>
                  <button
                    type="button"
                    onClick={handleClearSort}
                    className="hover:bg-blue-200 rounded p-0.5 transition-colors cursor-pointer text-blue-700"
                    title="Clear sorting"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>

            {sortBy && (
              <button
                type="button"
                onClick={handleClearSort}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Reset Sorting
              </button>
            )}
          </div>

          <div className="bg-[#EAEEF8] rounded-xl">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="text-gray-700 font-bold bg-white/70 border-2 border-white text-[12px] xl:text-[13px] capitalize shadow-xs">
                    <th className="p-2.5 rounded-l-xl w-[16%]">
                      <SortHeader label="Player" sortKey="Player" />
                    </th>
                    <th className="p-2.5 w-[6%]">
                      <SortHeader label="Grad" sortKey="Grad" />
                    </th>
                    <th className="p-2.5 w-[10%]">
                      <SortHeader label="Position" sortKey="Position" />
                    </th>
                    <th className="p-2.5 w-[13%]">
                      <div className="flex items-center gap-1">
                        <SortHeader label="Football" sortKey="Football Character" />
                        <span className="text-gray-400 font-normal">/</span>
                        <SortHeader label="Personal" sortKey="Personal Character" />
                      </div>
                    </th>
                    <th className="p-2.5 w-[5%] text-center">
                      <SortHeader label="H" sortKey="Height" className="justify-center" />
                    </th>
                    <th className="p-2.5 w-[5%] text-center">
                      <SortHeader label="W" sortKey="Width" className="justify-center" />
                    </th>
                    <th className="p-2.5 w-[13%]">
                      <SortHeader label="High School" sortKey="High School" />
                    </th>
                    <th className="p-2.5 w-[9%]">
                      <SortHeader label="State" sortKey="State" />
                    </th>
                    <th className="p-2.5 w-[15%]">
                      <SortHeader label="Committed College" sortKey="Committed College" />
                    </th>
                    <th className="p-2.5 rounded-r-xl w-[8%] text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <TableSkeleton rows={5} />
                  ) : displayData?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center text-gray-400 py-10 text-[14px]"
                      >
                        No Saved Athlete Found
                      </td>
                    </tr>
                  ) : (
                    displayData?.map((p, i) => (
                      <tr
                        key={p?._id || i}
                        onClick={() => handleAthleteClick(p)}
                        className="cursor-pointer border-b border-gray-200/50 hover:bg-white/40 transition-colors"
                      >
                        <td className="p-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={p.basicInfo?.image || Emptyimg}
                              alt={p.basicInfo?.name}
                              className="w-7 h-7 rounded-full border border-gray-200 object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span
                                title={p.basicInfo?.name}
                                className="font-medium text-gray-800 text-[13px] truncate block min-w-0"
                              >
                                {p.basicInfo?.name || "N/A"}
                              </span>
                              {p.basicInfo?.status?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {p.basicInfo.status.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="py-0.5 px-1 text-[8px] rounded-full font-semibold border border-gray-300 text-gray-600 bg-white/70"
                                    >
                                      {tag.toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td
                          title={p.basicInfo?.gradYear}
                          className="p-2.5 text-gray-700 text-[13px] font-medium truncate"
                        >
                          {p.basicInfo?.gradYear || "N/A"}
                        </td>

                        <td
                          title={p.basicInfo?.position}
                          className="p-2.5 text-gray-700 text-[13px] truncate"
                        >
                          {p.basicInfo?.position || "N/A"}
                        </td>

                        <td className="p-2.5">
                          <div className="flex gap-1.5 items-center">
                            <span
                              className={`flex items-center justify-center border-2 ${getGradeColor(
                                p.athlete?.footballPiScore,
                              )} text-white rounded-lg font-bold text-[12px] px-1.5 py-0.5 min-w-[2.2rem] shadow-2xs`}
                              title={`Football Character: ${p.athlete?.footballPiScore || "--"}`}
                            >
                              {p.athlete?.footballPiScore || "--"}
                            </span>
                            <span
                              className={`flex items-center justify-center border-2 ${getGradeColor(
                                p.athlete?.personalPiScore,
                              )} text-white rounded-lg font-bold text-[12px] px-1.5 py-0.5 min-w-[2.2rem] shadow-2xs`}
                              title={`Personal Character: ${p.athlete?.personalPiScore || "--"}`}
                            >
                              {p.athlete?.personalPiScore || "--"}
                            </span>
                          </div>
                        </td>

                        <td
                          title={p.basicInfo?.height}
                          className="p-2.5 text-center text-gray-700 text-[13px] truncate"
                        >
                          {p.basicInfo?.height || "N/A"}
                        </td>

                        <td
                          title={p.basicInfo?.weight}
                          className="p-2.5 text-center text-gray-700 text-[13px] truncate"
                        >
                          {p.basicInfo?.weight || "N/A"}
                        </td>

                        <td
                          title={p.basicInfo?.schoolName || p.basicInfo?.hometown}
                          className="p-2.5 text-gray-700 text-[13px] truncate"
                        >
                          {p.basicInfo?.schoolName || p.basicInfo?.hometown || "N/A"}
                        </td>

                        <td
                          title={p.basicInfo?.state}
                          className="p-2.5 text-gray-700 text-[13px] truncate"
                        >
                          {p.basicInfo?.state || "N/A"}
                        </td>

                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <img
                              src={p.basicInfo?.committedCollege?.logo || Emptyimg}
                              alt="College Logo"
                              className="w-[22px] h-[22px] object-contain flex-shrink-0"
                            />
                            <span
                              title={p.basicInfo?.committedCollege?.name || "N/A"}
                              className="text-[13px] text-gray-700 truncate font-medium block min-w-0"
                            >
                              {p.basicInfo?.committedCollege?.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={removeLoading === p?._id}
                            onClick={() => handleSave(p?._id)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                              removeLoading === p?._id
                                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                                : "bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 shadow-sm cursor-pointer"
                            }`}
                            title="Remove from saved"
                          >
                            {removeLoading === p?._id ? "..." : "Remove"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>

              {!isLoading && displayData?.length > 0 && (
                <Pagination
                  pagination={{ currentPage: page, totalPages }}
                  onPageChange={(newPage) => setPage(newPage)}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(newVal) => {
                    setItemsPerPage(newVal);
                    setPage(1);
                  }}
                  itemsPerPageOptions={[10, 25, 50, 100]}
                />
              )}
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {isLoading ? (
                <div className="text-center p-10 text-[14px] text-gray-400">
                  Loading...
                </div>
              ) : displayData?.length === 0 ? (
                <div className="text-center p-10 text-[14px] text-gray-400 bg-white/40 rounded-xl">
                  No Saved Athlete Found
                </div>
              ) : (
                displayData?.map((p, i) => (
                  <div
                    key={p?._id || i}
                    className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAthleteClick(p)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.basicInfo?.image || Emptyimg}
                          alt={p.basicInfo?.name}
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <span
                            title={p.basicInfo?.name}
                            className="font-medium text-gray-800 text-[14px] truncate block max-w-[200px]"
                          >
                            {p.basicInfo?.name || "N/A"}
                          </span>
                          {p.basicInfo?.status?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {p.basicInfo.status.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="py-0.5 px-1.5 text-[8px] rounded-full font-semibold border border-gray-300 text-gray-600 bg-gray-50"
                                >
                                  {tag.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        disabled={removeLoading === p?._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(p?._id);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                          removeLoading === p?._id
                            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                            : "bg-white hover:bg-red-50 text-red-600 border-red-200 shadow-sm cursor-pointer"
                        }`}
                      >
                        {removeLoading === p?._id ? "Removing..." : "Remove"}
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Grad:</span>
                        <span className="text-gray-800">
                          {p.basicInfo?.gradYear || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Position:</span>
                        <span className="text-gray-800">
                          {p.basicInfo?.position || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">
                          Football Score:
                        </span>
                        <span
                          className={`flex items-center justify-center border-2 ${getGradeColor(
                            p.athlete?.footballPiScore,
                          )} text-white rounded-xl font-bold text-[14px] px-2 py-0.5 min-w-[2rem]`}
                        >
                          {p.athlete?.footballPiScore || "--"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">
                          Personal Score:
                        </span>
                        <span
                          className={`flex items-center justify-center border-2 ${getGradeColor(
                            p.athlete?.personalPiScore,
                          )} text-white rounded-xl font-bold text-[14px] px-2 py-0.5 min-w-[2rem]`}
                        >
                          {p.athlete?.personalPiScore || "--"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Height:</span>
                        <span className="text-gray-800">
                          {p.basicInfo?.height || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Weight:</span>
                        <span className="text-gray-800">
                          {p.basicInfo?.weight || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          High School:
                        </span>
                        <span className="text-gray-800 break-words">
                          {p.basicInfo?.schoolName || p.basicInfo?.hometown || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">State:</span>
                        <span className="text-gray-800">
                          {p.basicInfo?.state || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">
                          Committed College:
                        </span>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              p.basicInfo?.committedCollege?.logo || Emptyimg
                            }
                            alt="College Logo"
                            className="w-[20px] h-[20px] object-contain"
                          />
                          <span className="text-gray-800 text-[12px]">
                            {p.basicInfo?.committedCollege?.name || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {!isLoading && displayData?.length > 0 && (
                <Pagination
                  pagination={{ currentPage: page, totalPages }}
                  onPageChange={(newPage) => setPage(newPage)}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(newVal) => {
                    setItemsPerPage(newVal);
                    setPage(1);
                  }}
                  itemsPerPageOptions={[10, 25, 50, 100]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
