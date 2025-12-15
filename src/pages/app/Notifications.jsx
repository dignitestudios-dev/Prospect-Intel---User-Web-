import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import NotificationsModal from "../../components/NotificationsModal";

const Notifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Notification 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor...",
      date: "22 Sep, 2025",
      time: "08:00 PM",
    },
    {
      id: 2,
      title: "Notification 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do tempor...",
      date: "23 Sep, 2025",
      time: "10:00 AM",
    },
    // Add more notifications as needed
  ];

  return (
    <div className="p-6 min-h-screen pt-2 text-white">
      {/* Header */}
      <div className="background-gradients relative p-6 rounded-xl shadow-md border border-gray-700 overflow-hidden mt-4 flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-1 button-bg rounded-t-3xl" />

        <h1 className="text-[32px] md:text-[36px] font-bold mb-4 md:mb-0">
          Notifications
        </h1>

        <div className="flex text-white rounded-lg shadow p-1 button-bg">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-1 rounded-lg font-medium flex items-center gap-2"
          >
            <span className="text-2xl">+</span>
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Notifications Cards */}
        <section className="mt-6 background-gradients border border-gray-700 p-6 rounded-xl space-y-6">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="background-gradient border border-gray-700 p-6 rounded-xl hover:bg-opacity-80 transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-gray-200">{notification.title}</div>
                <div className="text-sm text-gray-400">{notification.date}</div>
              </div>
              <p className="mt-2 text-gray-300">{notification.description}</p>
              <div className="flex justify-end">
                <button
                  className="text-red-500 hover:text-red-400 transition"
                  onClick={() => alert(`Delete Notification ${notification.id}`)} // handle delete here
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </section>

      {/* Modal */}
      <NotificationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Notifications;
