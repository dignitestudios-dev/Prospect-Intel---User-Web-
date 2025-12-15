import { Outlet } from "react-router";
import DummyNavbar from "../components/layout/DummyNavbar";
import DummySidebaar from "../components/layout/DummySidebaar";
import { useEffect, useState } from "react";
import NoInternetModal from "../components/global/NoInternet";
import { NoInternetImage } from "../assets/export";
import { background } from "../assets/export";

const DashboardLayout = () => {
  const [openNoInternet, setOpenNoInternet] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      setOpenNoInternet(true);
    }
  }, []);

  return (
    <div className="overflow-y-auto bg-[#EAEEF8] h-full min-h-screen w-full  "
    
  //   style={{
  //   backgroundImage: `url(${background})`,
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  // }}
>
    
    <div className="">
    <div className="w-full h-screen flex overflow-hidden">
      {/* <div className="h-full mt-4 ml-4 rounded-xl border border-gray-700 overflow-y-auto overflow-hidden scrollbar-hidden">
        <DummySidebaar />
      </div> */}

      <div className="flex flex-col w-full  ">
        <div className="  rounded-lg  flex justify-center items-center">
          <div className="w-full">
            <DummyNavbar />
          </div>
        </div>

        <div className="w-full  h-[calc(100%-2.5rem)] overflow-auto scrollbar-hidden">
          <img src={NoInternetImage} alt="" className="hidden" />
          <NoInternetModal isOpen={openNoInternet} />
          <Outlet />
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};


export default DashboardLayout;
