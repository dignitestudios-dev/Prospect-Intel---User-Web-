import React from 'react';

const Saved = () => {
  // Dummy data for players
  const playersData = [
    {
      img: "https://randomuser.me/api/portraits/men/1.jpg",
      name: "John Doe",
      grad: "2024",
      position: "Guard",
      status: "Archived",
      h: "6'3\"",
      w: "210 lbs",
      location: "New York, NY",
    },
    {
      img: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Jane Smith",
      grad: "2025",
      position: "Forward",
      status: "Archived",
      h: "6'0\"",
      w: "190 lbs",
      location: "Los Angeles, CA",
    },
    {
      img: "https://randomuser.me/api/portraits/men/3.jpg",
      name: "Sam Wilson",
      grad: "2023",
      position: "Center",
      status: "Archived",
      h: "6'8\"",
      w: "250 lbs",
      location: "Chicago, IL",
    }
  ];

  return (
    <div className="bg-[#EAEEF8] rounded-xl p-4">
      {/* Title */}
      <p className="text-[16px] font-bold mb-4">Saved Athletes</p>

      {/* Table Header */}
      <div className="grid grid-cols-8 text-gray-500 rounded-xl font-semibold bg-white/30 border-2 border-white p-6 text-[14px] capitalize px-4">
        <div className="ml-2">Player</div>
        <div className="px-12">Grad</div>
        <div>Position</div>
        <div>Status</div>
        <div className="">H</div>
        <div className="">W</div>
        <div>Location</div>
        <div>Action</div>
      </div>

      {/* Table Rows */}
      {playersData.map((p, i) => (
        <div key={i} className="grid grid-cols-8 items-center py-4 text-sm px-4">
          <div className="flex items-center gap-3">
            <img src={p.img} alt={p.name} className="w-8 h-8 rounded-full border border-gray-200" />
            <span className="font-medium text-gray-800 text-[13px] whitespace-nowrap">{p.name}</span>
          </div>

          <div className="text-gray-600 text-[13px] px-12">{p.grad}</div>
          <div className="text-gray-600 text-[13px]">{p.position}</div>

          <div className="text-gray-600 text-[13px] text-center pr-20">
            <span className="py-1 px-3 text-xs rounded-full bg-red-200 text-red-800 font-semibold">
              {p.status}
            </span>
          </div>

          <div className="text-gray-600 text-[13px]">{p.h}</div>
          <div className="text-gray-600 text-[13px]">{p.w}</div>
          <div className="text-gray-600 text-[13px]">{p.location}</div>
          
          {/* Action Column */}
          <div className="text-black text-[13px] font-medium cursor-pointer hover:underline">
            Remove
          </div>
        </div>
      ))}
    </div>
  );
};

export default Saved;
