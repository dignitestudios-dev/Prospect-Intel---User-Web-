
import { useNavigate } from "react-router";
import { TableSkeleton } from "./global/Skeleton";
import Pagination from "./global/Pagination";
import { useAppDispatch } from "../lib/store/hook";
import { logActivity } from "../lib/store/actions/activityActions";
import { useQueryClient } from "@tanstack/react-query";
import { Emptyimg } from "../assets/export";


const ArchivedTable = ({ players, loading, pagination, setPage, selectedIds, setSelectedIds }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.totalPages) {
      setPage(newPage);
    }
  };

  const getGradeColor = (score) => {
    const grade = score?.charAt(0)?.toUpperCase();

    const colorMap = {
      A: "bg-[#0F0F0F]",
      B: "bg-[#1DB863]",
      C: "bg-[#909090]",
      D: "bg-[#F9C933] text-black",
      F: "bg-[#FF3A3A]",
    };

    return colorMap[grade] || "bg-gray-400";
  };






  return (
    <div className="bg-[#EAEEF8] rounded-xl">
      {/* Table Header */}
      <div className="grid grid-cols-10 text-gray-500 rounded-xl font-semibold bg-white/30 border-2 border-white p-6 text-[14px] capitalize px-2">
        <input type="checkbox"

          checked={selectedIds.length === players?.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(players?.map((a) => a._id))
            } else {
              setSelectedIds([])
            }
          }} className="w-6 h-6 rounded-xl place-self-center text-black bg-white border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500" />
        <div className="ml-2">Player</div>
        <div className="px-12">Grad</div>
        <div>Position</div>
        <div className="whitespace-nowrap">Football/ Personal Character</div>
        <div className="px-20">H</div>
        <div className="px-10">W</div>
        <div>High School</div>
        <div>State</div>

        <div>Committed College</div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : players?.length === 0 ? (
        <div className="text-center p-10 text-[14px] text-gray-400 ">Athlete Not Found </div>
      ) :
        players?.map((p, i) => (
          <div key={i}
            onClick={() => {
              dispatch(
                logActivity({
                  title: "Opened Player Profile",
                  description: "Opened Player Profile",
                  metaData: {
                    type: "ProfileView",
                    athleteImg: p.basicInfo?.image,
                    athleteName: p?.basicInfo?.name
                  },
                })
              );
              queryClient.invalidateQueries(["athlete", p?._id])
              navigate(`/app/profile/${p?._id}`)
            }}

            className="grid cursor-pointer grid-cols-10 items-center py-4 text-sm px-2">
            <input
              checked={selectedIds.includes(p?._id)}
              onChange={(e) => {
                e.stopPropagation();

                if (e.target.checked) {
                  setSelectedIds((prev) => [...prev, p?._id])
                } else {
                  setSelectedIds((prev) =>
                    prev.filter((id) => id !== p?._id)
                  )
                }
              }}
              onClick={(e) => e.stopPropagation()}
              type="checkbox"
              className="w-6 h-6 place-self-center text-black rounded "
            />

            <div className="flex items-center gap-3">
              <img src={p.basicInfo?.image || Emptyimg} alt={p.basicInfo?.name} className="w-8 h-8 rounded-full border border-gray-200" />
              <span className="font-medium text-gray-800 text-[13px] truncate max-w-[150px] block">{p.basicInfo?.name}</span>
            </div>
            <div className="text-gray-600 text-[13px] px-12">  {p.basicInfo?.gradYear}</div>
            <div className="text-gray-600 text-[13px]">{p.basicInfo?.position}</div>
            <div className="flex gap-3 px-4 items-center">
              <span className={`flex items-center justify-center border-2 ${getGradeColor(p.athlete?.footballPiScore)} text-white rounded-xl font-bold text-[16px] px-3 py-2 min-w-[3rem]`}>
                {p.athlete?.footballPiScore || "--"}
              </span>
              <span className={`flex items-center justify-center border-2 ${getGradeColor(p.athlete?.personalPiScore)} text-white rounded-xl font-bold text-[16px] px-3 py-2 min-w-[3rem]`}>
                {p.athlete?.personalPiScore || "--"}
              </span>
            </div>
            <div className="text-gray-600 text-[13px] px-20">{p.basicInfo?.height || "N/A"}</div>
            <div className="text-gray-600 text-[13px] px-10">{p.basicInfo?.weight || "N/A"}</div>
            <div className="text-gray-600 text-[13px] break-all">{p.basicInfo?.schoolName || "N/A"}</div>
            <div className="text-gray-600 text-[13px] px-3">{p.basicInfo?.state || "N/A"}</div>
            <div className="flex items-center gap-2">
              <img src={p.basicInfo?.committedCollege?.logo || Emptyimg} alt="College Logo" className="w-[30px] h-[30px] object-contain" />
              <span className="text-[14px] text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{p.basicInfo?.committedCollege?.name || "N/A"}</span>
            </div>

          </div>
        ))}
      <Pagination
        pagination={pagination || { currentPage: 1, totalPages: 1 }}
        onPageChange={handlePageChange}
      />


    </div>
  );
};

export default ArchivedTable;
