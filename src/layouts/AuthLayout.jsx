import React from "react";
import { Outlet } from "react-router";
import { loginbg } from "../assets/export";
import DummyNavbar from "../components/layout/DummyNavbar";

const AuthLayout = () => {
  return (
    <>
    <div className="">
                    {/* <DummyNavbar /> */}
</div>
    <div className="relative w-screen min-h-screen bg-[#EAEEF8] flex justify-center items-center ">

      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default AuthLayout;
