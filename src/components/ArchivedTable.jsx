// const ArchivedTable = ({ players }) => {
//   return (
//     <div className="bg-[#EAEEF8] rounded-xl">
//       {/* Table Header */}
//       <div className="grid grid-cols-8 text-gray-500 rounded-xl font-semibold bg-white/30 border-2 border-white p-6 text-[14px] capitalize px-2">
//         <div className="ml-2">Player</div>
//         <div className="px-12">Grad</div>
//         <div>Position</div>
//         <div>Status</div> {/* Changed this for Archived */}
//         <div className="">H</div>
//         <div className="">W</div>
//         <div>Location</div>
//         <div>Committed College</div>
//       </div>

//       {/* Table Rows */}
//       {players.map((p, i) => (
//         <div key={i} className="grid grid-cols-8 items-center py-4 text-sm px-2">
//           <div className="flex items-center gap-3">
//             <img src={p.img} alt={p.name} className="w-8 h-8 rounded-full border border-gray-200" />
//             <span className="font-medium text-gray-800 text-[13px] whitespace-nowrap">{p.name}</span>
//           </div>
//           <div className="text-gray-600 text-[13px] px-12">{p.grad}</div>
//           <div className="text-gray-600 text-[13px]">{p.position}</div>
//           <div className="text-gray-600 text-[13px] text-center pr-20">
//             <span className="py-1 px-3 text-xs rounded-full bg-red-200 text-red-800 font-semibold">Archived</span>
//           </div>
//           <div className="text-gray-600 text-[13px] ">{p.h}</div>
//           <div className="text-gray-600 text-[13px] ">{p.w}</div>
//           <div className="text-gray-600 text-[13px]">{p.location}</div>
//           <div className="flex items-center gap-2">
//             <img src={p.collegeLogo} alt="College Logo" className="w-5 h-5 object-contain" />
//             <span className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{p.collegeName}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ArchivedTable;

import React from "react";
import { useNavigate } from "react-router";


const ArchivedTable = ({ players }) => {
    const navigate = useNavigate();
  
  return (
    <div className="bg-[#EAEEF8] rounded-xl">
      {/* Table Header */}
      <div className="grid grid-cols-9 text-gray-500 rounded-xl font-semibold bg-white/30 border-2 border-white p-6 text-[14px] capitalize px-2">
        <input type="checkbox" className="w-6 h-6 rounded-xl place-self-center text-black bg-white border-2 border-gray-300 checked:bg-blue-600 checked:border-blue-600 focus:ring-2 focus:ring-blue-500" />
        <div className="ml-2">Player</div>
        <div className="px-12">Grad</div>
        <div>Position</div>
        <div className="whitespace-nowrap">Football/ Personal Character</div>
        <div className="px-20">H</div>
        <div className="px-10">W</div>
        <div>Location</div>
        <div>Committed College</div>
      </div>

      {/* Table Rows */}
      {players.map((p, i) => (
        <div key={i} 
                  onClick={() => navigate("/app/profile")}

        className="grid grid-cols-9 items-center py-4 text-sm px-2">
          <input type="checkbox" className="w-6 h-6 place-self-center text-black rounded " defaultChecked={i === 3} />
          <div className="flex items-center gap-3">
            <img src={p.img} alt={p.name} className="w-8 h-8 rounded-full border border-gray-200" />
            <span className="font-medium text-gray-800 text-[13px] whitespace-nowrap">{p.name}</span>
          </div>
          <div className="text-gray-600 text-[13px] px-12">{p.grad}</div>
          <div className="text-gray-600 text-[13px]">{p.position}</div>
          <div className="flex gap-3 px-4 items-center">
            {/* <span className="flex items-center border-2 border-[#0085CA] justify-center w-10 h-10 bg-white text-[#0085CA] rounded-md font-bold text-[18px]">
              {p.football}
            </span>
            <span className="flex items-center justify-center w-10 h-10 border-2 border-[#FFC145] bg-white text-[#FFC145] rounded-md font-bold text-[18px]">
              {p.personal}
            </span> */}
             <span className="flex items-center border-2 justify-center w-10 h-10 bg-black text-white rounded-xl font-bold text-[18px]">
              {p.football}
            </span>
            <span className="flex items-center justify-center w-10 h-10 border-2  bg-[#909090] text-white rounded-xl font-bold text-[18px]">
              {p.personal}
            </span>
          </div>
          <div className="text-gray-600 text-[13px] px-20">{p.h}</div>
          <div className="text-gray-600 text-[13px] px-10">{p.w}</div>
          <div className="text-gray-600 text-[13px]">{p.location}</div>
          <div className="flex items-center gap-2">
            <img src={p.collegeLogo} alt="College Logo" className="w-5 h-5 object-contain" />
            <span className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{p.collegeName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchivedTable;
