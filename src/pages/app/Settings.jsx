import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { getProfile } from '../../lib/query/queryFn';
import { formatDate } from '../../lib/helpers';
import axiosinstance from '../../axios';
import { ErrorToast, SuccessToast } from '../../components/global/Toaster';
import { useAppDispatch } from '../../lib/store/hook';
import { login } from '../../lib/store/feature/authSlice';
import Cookies from 'js-cookie';



export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [saveLoading, setSaveLoading] = useState(false)
  const [name, setName] = useState('')

  const [activeSection, setActiveSection] = useState('profile');


  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleRequestPasswordClick = () => {

    navigate("/auth/reset-password");
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profileMe"],
    queryFn: getProfile,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });


  const handleUpdate = async () => {
    setSaveLoading(true)
    try {
      const response = await axiosinstance.put('/user/update/name', {
        name: name
      })
      if (response?.status === 200) {
        SuccessToast(response?.data?.message)
        const updatedUser = response?.data?.data;
        console.log(updatedUser)

        dispatch(login({
          token: Cookies.get("userToken"),
          user: updatedUser
        }));
        refetch()
      }
    } catch (err) {
      console.log(err, "err")
      ErrorToast(err?.response?.data?.message)
    } finally {
      setSaveLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-[#E9EEF7] flex p-8">

      <div className="w-64 p-8 pt-0">

        <div className="text-gray-700 font-medium mb-10 text-[24px]">
          My Account
        </div>
        <div className="text-gray-700 font-medium mb-10">
          {data?.email}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSectionChange('profile')}
            className={`w-[100px] text-left px-4 py-2 rounded-md shadow-sm border text-gray-700 font-medium ${activeSection === 'profile' ? 'bg-[#FAF8F2]' : 'shadow-none border-none'
              }`}
          >
            Profile
          </button>

          {/* <button
            onClick={() => handleSectionChange('password')}
            className={`w-[100px] text-left px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 ${activeSection === 'password' ? 'bg-[#FAF8F2]' : 'shadow-none border-none'
              }`}
          >
            Password
          </button> */}
        </div>
      </div>

      <div className="flex-1 p-8 w-[980px] h-[533px]">
        <div className="p-10 shadow-sm bg-transparent bg-opacity-25 pt-8 rounded-xl border-2 border-white">

          {activeSection === 'password' ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
              <p className="text-gray-500 mb-6">
                To change your password, click the button below to request a password change.
              </p>

              <button className="bg-[#0085CA] text-white px-5 py-3 rounded-xl hover:opacity-90" onClick={handleRequestPasswordClick}>
                Request Password Change
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Profile</h2>
              <p className="text-gray-500">Change your username</p>

              <hr className="my-6 border-gray-200" />

              <div className="grid grid-cols-2 gap-6">
                <div className="relative w-full">
                  <div className="w-full  bg-gray-200  border border-gray-300 rounded-lg px-4 pt-5 pb-3">
                    <label className="absolute left-4 top-2 text-gray-500 text-xs pointer-events-none">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      defaultValue={data?.email}
                      className="w-full focus:outline-none text-gray-800 pt-1"
                    />
                  </div>
                </div>

                <div className="relative w-full">
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-4 pt-5 pb-3">
                    <label className="absolute left-4 top-2 text-gray-500 text-xs pointer-events-none">
                      Username
                    </label>

                    <input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      value={name || data?.name}
                      className="w-full bg-transparent focus:outline-none text-gray-800 pt-1"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end mt-6">
                <button disabled={saveLoading} onClick={handleUpdate} className="bg-[#0085CA] text-white px-5 py-3 rounded-xl hover:opacity-90">
                  {saveLoading ? "Saving..." : "Save"}
                </button>
              </div>

              <hr className="my-6 border-gray-200" />

              <div className="mb-6">
                <h3 className="text-gray-500 text-sm mb-1">Phone</h3>
                <p className="text-gray-800">{data?.phone || "N/A"}</p>
              </div>

              <hr className="my-6 border-gray-200" />

              <div>
                <h3 className="text-gray-700 font-medium mb-1">Subscription Status</h3>

                <p className="text-[#0088DA] font-extrabold text-lg">
                  {data?.subscriptionPlan}
                  <span className="text-gray-500 font-normal text-sm ml-2">
                    (Ending on {formatDate(data?.subscriptionEndDate)})
                  </span>
                </p>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
