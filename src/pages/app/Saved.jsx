import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getAtheleteSave } from '../../lib/query/queryFn';
import { TableSkeleton } from '../../components/global/Skeleton';
import axiosinstance from '../../axios';
import { ErrorToast, SuccessToast } from '../../components/global/Toaster';

const Saved = () => {
  const [removeLoading, setRemoveLoading] = useState(null)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["atheletesave"],
    queryFn: getAtheleteSave,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const handleSave = async (id) => {
    setRemoveLoading(id);
    try {
      const response = await axiosinstance.post('/user/athlete/save', { athleteId: id })
      if (response?.status === 200) {
        SuccessToast("Removed Successfully")
        refetch()
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.messsage)
    } finally {
      setRemoveLoading(null);
    }
  }

  return (
    <div className="bg-[#EAEEF8] rounded-xl p-4">

      <div className="bg-[#EAEEF8] rounded-xl p-4">
        <p className="text-[16px] font-bold mb-4">Saved Athletes</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">


            <thead>
              <tr className="bg-white/50 text-gray-600 text-sm">
                <th className="text-left p-3">Player</th>
                <th className="text-left p-3">Grad</th>
                <th className="text-left p-3">Committed College</th>
                <th className="text-left p-3">Position</th>
                <th className="text-center p-3">Status</th>
                <th className="text-left p-3">H</th>
                <th className="text-left p-3">W</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Action</th>
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
                  <td colSpan="9" className="text-center text-gray-400 py-6">
                    No Saved Athlete Found
                  </td>
                </tr>
              ) : (
                data?.map((p, i) => (
                  <tr key={i} className="border-t text-sm hover:bg-white/40">


                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.basicInfo?.image || "https://placehold.co/400"}
                          alt={p.basicInfo?.name}
                          className="w-8 h-8 rounded-full border"
                        />
                        <span className="font-medium text-gray-800 text-[13px]">
                          {p.basicInfo?.name || "N/A"}
                        </span>
                      </div>
                    </td>


                    <td className="p-3 text-gray-600 text-[13px]">
                      {p.basicInfo?.gradYear || "N/A"}
                    </td>


                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.basicInfo?.committedCollege?.logo || "https://placehold.co/40"}
                          alt="College"
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-xs text-gray-600 truncate">
                          {p.basicInfo?.committedCollege?.name || "N/A"}
                        </span>
                      </div>
                    </td>


                    <td className="p-3 text-gray-600 text-[13px]">
                      {p.basicInfo?.position || "N/A"}
                    </td>


                    <td className="p-3 text-center">
                      {p.basicInfo?.status?.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-1">
                          {p.basicInfo.status.map((tag, idx) => (
                            <span
                              key={idx}
                              className="py-1 px-2 text-[10px] rounded-full bg-red-200 text-red-800 font-semibold"
                            >
                              {tag.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="py-1 px-2 text-[10px] rounded-full bg-gray-200 text-gray-500 font-semibold">
                          N/A
                        </span>
                      )}
                    </td>


                    <td className="p-3 text-gray-600 text-[13px]">
                      {p.basicInfo?.height || "N/A"}
                    </td>


                    <td className="p-3 text-gray-600 text-[13px]">
                      {p.basicInfo?.weight || "N/A"}
                    </td>


                    <td className="p-3 text-gray-600 text-[13px]">
                      {p.basicInfo?.state || "N/A"} / {p.basicInfo?.hometown || "N/A"}
                    </td>


                    <td className="p-3">
                      <button
                        disabled={removeLoading === p?._id}
                        onClick={() => handleSave(p?._id)}
                        className={`text-black text-[13px] font-medium ${removeLoading === p?._id
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
      </div>
    </div>
  );
};

export default Saved;
