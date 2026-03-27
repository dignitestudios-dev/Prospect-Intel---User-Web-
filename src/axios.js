import axios from "axios";
import { ErrorToast } from "./components/global/Toaster";
import Cookies from "js-cookie";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
// for local
// export const baseUrl = "https://dev.api.prospectintelhq.com/api";
// for Vercel
export const baseUrl = "https://staging.api.prospectintelhq.com/api";
let deviceFingerprint = "";
async function loadFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  deviceFingerprint = result.visitorId;
}

loadFingerprint();

const axiosinstance = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
});

axiosinstance.interceptors.request.use((request) => {
  const token = Cookies.get("userToken");
  if (!navigator.onLine) {
    ErrorToast(
      "No internet connection. Please check your network and try again.",
    );
    return;
  }

  request.headers = {
    ...request.headers,
    Accept: "application/json, text/plain, */*",
    devicemodel: deviceFingerprint,
    deviceIdentity: deviceFingerprint,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return request;
});

axiosinstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      ErrorToast("Your internet connection is slow. Please try again.");
    }

    if (error.response && error.response.status === 401) {
      Cookies.remove("userToken");
      Cookies.remove("user");
      ErrorToast("Session expired. Please relogin");
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axiosinstance;
