import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Logo, prospectLogo } from "../../assets/export";
import { Bell, Star, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAuth } from "../../lib/store/hook";
import { logout } from "../../lib/store/feature/authSlice";
import { logActivity } from "../../lib/store/actions/activityActions";
import { getNotification, getNotificationCount, getProfile } from "../../lib/query/queryFn";
import { useQuery } from "@tanstack/react-query";
import { formatDate, timeAgo } from "../../lib/helpers";
import Pagination from "../global/Pagination";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../global/Toaster";

const DropdownModal = ({ username, setIsModalOpen }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleLogout = async () => {
    try {

      await dispatch(
        logActivity({

          title: "User Logged Out",
          description: "User Logged Out",
          metaData: {
            type: "Logged Out",
          }
        })
      );


      dispatch(logout());


      navigate("/auth/login");
    } catch (error) {
      console.log("Logout Activity Error:", error);
    }
  };

  return (
    <div className="absolute right-4 mt-2 w-56 rounded-lg shadow-xl py-3 border border-gray-100 z-50  bg-[#EAEEF8]">

      <div className="flex items-center gap-2 px-4 pb-3 border-b border-gray-200 min-w-0">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img src={Logo} alt="Logo" className="h-full" />
        </div>

        <span
          className="text-base font-semibold text-gray-800 truncate max-w-[140px]"
          title={username}
        >
          {username}
        </span>
      </div>

      <p className="text-xs font-medium text-gray-500 uppercase px-4 pt-3 pb-1">
        Account
      </p>


      <div className="space-y-1">

        <Link
          to={"/app/settings"}
          onClick={() => setIsModalOpen(false)}

          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600">
            <User className="text-sm" />
          </div>
          <span className="text-sm font-medium text-gray-700">My Account</span>
        </Link>


        <Link
          to={"/app/saved"}
          onClick={() => setIsModalOpen(false)}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-600">
            <Star className="text-sm" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Saved Athletes
          </span>
        </Link>


        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
        >

          <div className="w-8 h-8 rounded-lg border border-red-400 bg-red-50 flex items-center justify-center text-red-500">
            <IoIosLogOut className="text-xl" />
          </div>
          <span className="text-sm font-medium text-gray-700">Log Out</span>
        </button>
      </div>
    </div>
  )
}
const DummyNavbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readLoading, setReadLoading] = useState(false)
  const [page, setPage] = useState(1)
  const notifRef = useRef(null);
  const { user } = useAuth();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: ["profileMe"],
    queryFn: getProfile,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notification", page],
    queryFn: () => getNotification({ page }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const { data: notificationCount, isLoading: notificationLoading, refetch: notificationRefetch } = useQuery({
    queryKey: ["notificationCount", page],
    queryFn: () => getNotificationCount({ page }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });



  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data?.pagination?.totalPages) {
      setPage(newPage);
    }
  };

  const handleReadAll = async () => {
    setReadLoading(true)
    try {
      const response = await axiosinstance.patch('/notification/read')
      if (response?.status === 200) {
        SuccessToast(response?.data?.message)
        refetch()
        notificationRefetch()

      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message)
    } finally {
      setReadLoading(false)
    }
  }

  return (
    <div className="w-full border-b border-gray-300 bg-[#EAEEF8] h-20 px-4  flex justify-between items-center">

      <div className="flex items-center gap-2">
        <img
          onClick={() => navigate("/app/dashboard")}
          src={prospectLogo}
          loading="lazy"
          alt="logo-organization"
          className="h-10 cursor-pointer"
        />
        <div className="bg-white rounded-full p-1.5">
          <span className="text-sm font-semibold text-[#0085CA]">PRO</span>
          <span className="text-xs font-extralight text-gray-500 ml-2">
            (Ending on {formatDate(profile?.subscriptionEndDate)})
          </span>
        </div>
      </div>


      <div className="relative">
        <div className="flex items-center gap-4">


          <div className="relative">

            {/* {notificationCount?.count && ( */}
            <span className="absolute -top-2 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {notificationCount?.count}
            </span>
            {/* )} */}

            <Bell
              className="cursor-pointer text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setIsNotifOpen(!isNotifOpen);
                setIsModalOpen(false);
              }}
              size={30}
            />

            {isNotifOpen && (
              <div ref={notifRef}>
                <NotificationDropdown
                  noti={data?.data}
                  isLoading={isLoading}
                  handleReadAll={handleReadAll}
                  readLoading={readLoading}
                  handlePageChange={handlePageChange}
                  pagination={data?.pagination}
                />
              </div>
            )}
          </div>

          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              setIsNotifOpen(false);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold mr-2">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <span className="text-sm font-medium text-gray-800">
              My Account
            </span>

            <FaChevronDown
              className={`text-gray-500 text-[10px] ml-2 transition-transform ${isModalOpen ? "rotate-180" : ""
                }`}
            />
          </div>
        </div>

        {isModalOpen && <DropdownModal username={user?.name} setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
  );
};

export default DummyNavbar;
const NotificationDropdown = ({ noti = [], handlePageChange, pagination, readLoading, handleReadAll, isLoading }) => {
  return (
    <div className="absolute right-0 mt-3 w-80 bg-[#F5F7FB] rounded-xl shadow-2xl border border-gray-200 z-50 p-4">


      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">
          Notifications
        </h3>
        <button onClick={handleReadAll} className="text-xs text-gray-400 hover:text-gray-600">
          {readLoading ? "Read...." : "Read All"}
        </button>
      </div>


      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">

        {noti.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No notifications
          </p>
        )}

        {isLoading ? (

          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-start bg-white p-3 rounded-lg shadow-sm animate-pulse"
            >
              <div className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0 bg-gray-200" />

              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          noti?.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-start bg-white p-3 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🕒</span>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {item?.title}
                  </h4>
                  <span className="text-xs text-gray-400">
                    {timeAgo(item?.createdAt) || "1min"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {item?.description}
                </p>
              </div>
            </div>
          ))
        )}

        <Pagination
          pagination={pagination || { currentPage: 1, totalPages: 1 }}
          onPageChange={handlePageChange}
        />

      </div>
    </div>
  );
};

