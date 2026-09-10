import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import { RefreshCcw } from "lucide-react";
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
  const [removeLoading, setRemoveLoading] = useState(null);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["atheletesave"],
    queryFn: getAtheleteSave,
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
      if (response?.status === 200) {
        SuccessToast("Removed Successfully");
        queryClient.invalidateQueries({ queryKey: ["atheletesave"] });
        refetch();
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message || err?.response?.data?.messsage || "Failed to remove athlete");
    } finally {
      setRemoveLoading(null);
    }
  };

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!debouncedSearch?.trim()) return data;

    const query = debouncedSearch.toLowerCase().trim();
    return data.filter((p) => {
      const name = p?.basicInfo?.name?.toLowerCase() || "";
      const school = p?.basicInfo?.schoolName?.toLowerCase() || "";
      const position = p?.basicInfo?.position?.toLowerCase() || "";
      const gradYear = String(p?.basicInfo?.gradYear || "");
      const college = p?.basicInfo?.committedCollege?.name?.toLowerCase() || "";
      const state = p?.basicInfo?.state?.toLowerCase() || "";
      const hometown = p?.basicInfo?.hometown?.toLowerCase() || "";
      return (
        name.includes(query) ||
        school.includes(query) ||
        position.includes(query) ||
        gradYear.includes(query) ||
        college.includes(query) ||
        state.includes(query) ||
        hometown.includes(query)
      );
    });
  }, [data, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  return (
    <div className="w-full min-h-screen h-full bg-[#F5F7FB] flex justify-center items-start font-sans">
      <div className="w-full h-full bg-[#EAEEF8] border-2 border-gray-100 mb-2 overflow-auto">
        {/* Top Header Bar consistent with Home */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-[380px]">
              <FaSearch className="absolute shadow-xl left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="text"
                placeholder="Search saved players"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full font-thin h-[50px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 text-sm shadow-sm"
              />
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {filteredData?.length || 0} Results
            </h3>
          </div>

          <div className="bg-[#EAEEF8] rounded-xl">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="text-gray-500 font-semibold bg-white/30 border-2 border-white text-[14px] capitalize">
                    <th className="p-4 rounded-l-xl">Player</th>
                    <th className="p-4">Grad</th>
                    <th className="p-4">Position</th>
                    <th className="p-4 whitespace-nowrap">Football / Personal Character</th>
                    <th className="p-4">H</th>
                    <th className="p-4">W</th>
                    <th className="p-4">High School</th>
                    <th className="p-4">State</th>
                    <th className="p-4">Committed College</th>
                    <th className="p-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <TableSkeleton rows={5} />
                  ) : filteredData?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center text-gray-400 py-10 text-[14px]"
                      >
                        No Saved Athlete Found
                      </td>
                    </tr>
                  ) : (
                    paginatedData?.map((p, i) => (
                      <tr
                        key={p?._id || i}
                        onClick={() => handleAthleteClick(p)}
                        className="cursor-pointer border-b border-gray-200/50 hover:bg-white/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <img
                              src={p.basicInfo?.image || Emptyimg}
                              alt={p.basicInfo?.name}
                              className="w-8 h-8 rounded-full border border-gray-200 object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-medium text-gray-800 text-[13px] break-all block min-w-0">
                                {p.basicInfo?.name || "N/A"}
                              </span>
                              {p.basicInfo?.status?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {p.basicInfo.status.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="py-0.5 px-1.5 text-[8px] rounded-full font-semibold border border-gray-300 text-gray-600 bg-white/70"
                                    >
                                      {tag.toUpperCase()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-gray-600 text-[13px]">
                          {p.basicInfo?.gradYear || "N/A"}
                        </td>

                        <td className="p-4 text-gray-600 text-[13px]">
                          {p.basicInfo?.position || "N/A"}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 items-center">
                            <span
                              className={`flex items-center justify-center border-2 ${getGradeColor(
                                p.athlete?.footballPiScore,
                              )} text-white rounded-xl font-bold text-[14px] px-2.5 py-1 min-w-[2.6rem]`}
                              title="Football Score"
                            >
                              {p.athlete?.footballPiScore || "--"}
                            </span>
                            <span
                              className={`flex items-center justify-center border-2 ${getGradeColor(
                                p.athlete?.personalPiScore,
                              )} text-white rounded-xl font-bold text-[14px] px-2.5 py-1 min-w-[2.6rem]`}
                              title="Personal Score"
                            >
                              {p.athlete?.personalPiScore || "--"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-gray-600 text-[13px]">
                          {p.basicInfo?.height || "N/A"}
                        </td>

                        <td className="p-4 text-gray-600 text-[13px]">
                          {p.basicInfo?.weight || "N/A"}
                        </td>

                        <td className="p-4 text-gray-600 text-[13px] break-words">
                          {p.basicInfo?.schoolName || p.basicInfo?.hometown || "N/A"}
                        </td>

                        <td className="p-4 text-gray-600 text-[13px]">
                          {p.basicInfo?.state || "N/A"}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={p.basicInfo?.committedCollege?.logo || Emptyimg}
                              alt="College Logo"
                              className="w-[28px] h-[28px] object-contain flex-shrink-0"
                            />
                            <span className="text-[13px] text-gray-600 break-words">
                              {p.basicInfo?.committedCollege?.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            disabled={removeLoading === p?._id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(p?._id);
                            }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                              removeLoading === p?._id
                                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
                                : "bg-white/80 hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 shadow-sm cursor-pointer"
                            }`}
                          >
                            {removeLoading === p?._id ? "Removing..." : "Remove"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>

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
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {isLoading ? (
                <div className="text-center p-10 text-[14px] text-gray-400">
                  Loading...
                </div>
              ) : filteredData?.length === 0 ? (
                <div className="text-center p-10 text-[14px] text-gray-400 bg-white/40 rounded-xl">
                  No Saved Athlete Found
                </div>
              ) : (
                paginatedData?.map((p, i) => (
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
                        <div className="min-w-0">
                          <span className="font-medium text-gray-800 text-[14px] break-all block min-w-0">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
