import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getAtheleteSave } from "../../lib/query/queryFn";
import { TableSkeleton } from "../../components/global/Skeleton";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { Emptyimg } from "../../assets/export";

const Saved = () => {
  const [removeLoading, setRemoveLoading] = useState(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["atheletesave"],
    queryFn: getAtheleteSave,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const handleSave = async (id) => {
    setRemoveLoading(id);
    try {
      const response = await axiosinstance.post("/user/athlete/save", {
        athleteId: id,
      });
      if (response?.status === 200) {
        SuccessToast("Removed Successfully");
        refetch();
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.messsage);
    } finally {
      setRemoveLoading(null);
    }
  };

  return (
    <div className="bg-[#EAEEF8] rounded-xl p-2 md:p-4">
      <div className="bg-[#EAEEF8] rounded-xl p-2 md:p-4">
        <p className="text-sm md:text-[16px] font-bold mb-4">Saved Athletes</p>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-white/50 text-gray-600">
                <th className="text-left p-2 md:p-3">Player</th>
                <th className="text-left p-2 md:p-3">Grad</th>
                <th className="text-left p-2 md:p-3">Committed College</th>
                <th className="text-left p-2 md:p-3">Position</th>
                <th className="text-center p-2 md:p-3">Status</th>
                <th className="text-left p-2 md:p-3">H</th>
                <th className="text-left p-2 md:p-3">W</th>
                <th className="text-left p-2 md:p-3">Location</th>
                <th className="text-left p-2 md:p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : data?.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-gray-400 py-4 md:py-6 text-xs md:text-sm"
                  >
                    No Saved Athlete Found
                  </td>
                </tr>
              ) : (
                data?.map((p, i) => (
                  <tr key={i} className="border-t hover:bg-white/40">
                    <td className="p-2 md:p-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <img
                          src={p.basicInfo?.image || Emptyimg}
                          alt={p.basicInfo?.name}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border"
                        />
                        <span className="font-medium text-gray-800 text-xs md:text-[13px]">
                          {p.basicInfo?.name || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="p-2 md:p-3 text-gray-600 text-xs md:text-[13px]">
                      {p.basicInfo?.gradYear || "N/A"}
                    </td>

                    <td className="p-2 md:p-3">
                      <div className="flex items-center gap-1 md:gap-2">
                        <img
                          src={
                            p.basicInfo?.committedCollege?.logo ||
                            "https://placehold.co/40"
                          }
                          alt="College"
                          className="w-4 h-4 md:w-5 md:h-5 object-contain"
                        />
                        <span className="text-xs text-gray-600 truncate">
                          {p.basicInfo?.committedCollege?.name || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="p-2 md:p-3 text-gray-600 text-xs md:text-[13px]">
                      {p.basicInfo?.position || "N/A"}
                    </td>

                    <td className="p-2 md:p-3 text-center">
                      {p.basicInfo?.status?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {p.basicInfo.status.map((tag, idx) => {
                            const colors = [
                              { bg: "#FF3A44", text: "#fff" },
                              { bg: "#3FB185", text: "#fff" },
                              { bg: "#7A4D8B", text: "#fff" },
                            ];

                            const color = colors[idx % colors.length];

                            return (
                              <span
                                key={idx}
                                className="py-1 px-1 md:px-2 text-[8px] md:text-[10px] rounded-full font-semibold"
                                style={{
                                  border: `1px solid ${color.bg}`,
                                  color: "black",
                                }}
                              >
                                {tag.toUpperCase()}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="py-1 px-1 md:px-2 text-[8px] md:text-[10px] rounded-full bg-gray-200 text-gray-500 font-semibold">
                          N/A
                        </span>
                      )}
                    </td>

                    <td className="p-2 md:p-3 text-gray-600 text-xs md:text-[13px]">
                      {p.basicInfo?.height || "N/A"}
                    </td>

                    <td className="p-2 md:p-3 text-gray-600 text-xs md:text-[13px]">
                      {p.basicInfo?.weight || "N/A"}
                    </td>

                    <td className="p-2 md:p-3 text-gray-600 text-xs md:text-[13px]">
                      {p.basicInfo?.state || "N/A"} /{" "}
                      {p.basicInfo?.hometown || "N/A"}
                    </td>

                    <td className="p-2 md:p-3">
                      <button
                        disabled={removeLoading === p?._id}
                        onClick={() => handleSave(p?._id)}
                        className={`text-black text-xs md:text-[13px] font-medium ${
                          removeLoading === p?._id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:underline"
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

        {/* Mobile Cards */}
        <div className="block md:hidden">
          {isLoading ? (
            <div className="text-center p-10 text-[14px] text-gray-400">
              Loading...
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center p-10 text-[14px] text-gray-400">
              No Saved Athlete Found
            </div>
          ) : (
            data?.map((p, i) => (
              <div key={i} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.basicInfo?.image || Emptyimg}
                      alt={p.basicInfo?.name}
                      className="w-10 h-10 rounded-full border border-gray-200"
                    />
                    <span className="font-medium text-gray-800 text-[14px]">
                      {p.basicInfo?.name || "N/A"}
                    </span>
                  </div>
                  <button
                    disabled={removeLoading === p?._id}
                    onClick={() => handleSave(p?._id)}
                    className={`text-black text-sm font-medium px-3 py-1 rounded ${
                      removeLoading === p?._id
                        ? "opacity-50 cursor-not-allowed bg-gray-200"
                        : "hover:bg-gray-100 bg-white border"
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
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">
                      Committed College:
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          p.basicInfo?.committedCollege?.logo ||
                          "https://placehold.co/40"
                        }
                        alt="College"
                        className="w-[20px] h-[20px] object-contain"
                      />
                      <span className="text-gray-800 text-[12px]">
                        {p.basicInfo?.committedCollege?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Position:</span>
                    <span className="text-gray-800">
                      {p.basicInfo?.position || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Status:</span>
                    <div className="flex flex-wrap gap-1">
                      {p.basicInfo?.status?.length > 0 ? (
                        p.basicInfo.status.map((tag, idx) => {
                          const colors = [
                            { bg: "#FF3A44", text: "#fff" },
                            { bg: "#3FB185", text: "#fff" },
                            { bg: "#7A4D8B", text: "#fff" },
                          ];
                          const color = colors[idx % colors.length];
                          return (
                            <span
                              key={idx}
                              className="py-1 px-2 text-[10px] rounded-full font-semibold"
                              style={{
                                border: `1px solid ${color.bg}`,
                                color: "black",
                              }}
                            >
                              {tag.toUpperCase()}
                            </span>
                          );
                        })
                      ) : (
                        <span className="py-1 px-2 text-[10px] rounded-full bg-gray-200 text-gray-500 font-semibold">
                          N/A
                        </span>
                      )}
                    </div>
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
                    <span className="font-medium text-gray-600">Location:</span>
                    <span className="text-gray-800">
                      {p.basicInfo?.state || "N/A"} /{" "}
                      {p.basicInfo?.hometown || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;
