import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaUser,
  FaShieldAlt,
  FaBook,
  FaCheckCircle,
} from "react-icons/fa";
import {
  athletic,
  personal,
  football,
  features,
  other,
  Emptyimg,
} from "../../assets/export";
import {
  SaveSuccessPopup,
  RequestSentPopup,
  SendMessageModal,
} from "../../components/PopupComponents";
import { useParams } from "react-router";
import { mockAtheleTableData } from "../../static/mockData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAtheleteById } from "../../lib/query/queryFn";
import {
  formatAthleteForCSV,
  formatDate,
  generateAthletePDF,
} from "../../lib/helpers";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { ProfileSkeleton } from "../../components/global/Skeleton";
import { useAppDispatch } from "../../lib/store/hook";
import { logActivity } from "../../lib/store/actions/activityActions";
import jsPDF from "jspdf";

// --- END DUMMY DATA ---

// Helper component for the Profile Header Stats (Grad, Position, Height, etc.)
const ProfileStat = ({ label, value, title }) => (
  <div className="flex flex-col items-center">
    <span className="text-gray-500 text-[28px] font-semibold">{label}</span>
    <span className="text-gray-900 text-[14px] font-bold break-words">
      {value}
    </span>
  </div>
);

// Helper component for the Info Boxes on the right side
const InfoBox = ({ title, score, icon, children }) => {
  // ✅ get first letter only (A+, A- → A)
  const grade = score?.charAt(0)?.toUpperCase();

  // ✅ color mapping
  const bgColor =
    grade === "A"
      ? "bg-[#131212]"
      : grade === "B"
        ? "bg-[#1DB863]"
        : grade === "C"
          ? "bg-[#909090]"
          : grade === "D"
            ? "bg-[#F9C933]"
            : grade === "F"
              ? "bg-[#FF3A3A]"
              : "bg-gray-400";

  return (
    <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center p-2 pb-0 text-xl font-bold text-gray-800">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>

        {score && (
          <div
            className={`flex items-center border border-gray-300 rounded-lg p-2 ${bgColor}`}
          >
            <span className="text-xs font-semibold text-white mr-2">
              PI Score
            </span>
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
        )}
      </div>

      <div className="p-6 rounded-xl shadow-sm mb-6 border-2 border-white">
        <div>{children}</div>
      </div>
    </div>
  );
};
// Helper component for Parent/Sibling rows
const InfoRow = ({ label, value, isBold = false }) => (
  <div className="flex justify-between py-1">
    <span className="text-gray-600 text-sm">{label}:</span>
    <span
      className={`text-gray-900 text-sm ${
        isBold ? "font-semibold" : "font-normal"
      }`}
    >
      {value}
    </span>
  </div>
);
const AthleticBox = ({ title, icon, children }) => (
  <div className="bg-white bg-opacity-25  pt-4  border-2 border-white rounded-2xl p-5">
    <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white  shadow-sm">
      <div className="flex items-center mb-4">
        <div className="flex items-center text-lg font-semibold text-gray-900">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    data: athleteDetail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["atheleteid", id],
    queryFn: () => getAtheleteById(id),
    enabled: !!id,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

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
  const defaultAthlete = {
    name: "Unknown Player",
    image: "https://placehold.co/100",
    grad: "N/A",
    position: "N/A",
    state: "N/A",
    school: "N/A",
    height: "N/A",
    weight: "N/A",
    gpa: "N/A",
    commitment: "N/A",
    statusTags: [],

    family: {
      mother: {},
      father: {},
      siblings: {},
      keyInfluences: "N/A",
    },

    athleticBackground: {
      activities: "N/A",
      coachEvaluation: "N/A",
      otherSports: [],
    },

    footballCharacter: {
      grade: "N/A",
      summary: "N/A",
    },

    personalCharacter: {
      grade: "N/A",
      summary: "N/A",
    },

    otherRelevantInfo: {
      summary: "N/A",
    },

    strengths: [],
    weaknesses: [],
  };
  const athlete =
    mockAtheleTableData.find((a) => a.id === Number(id)) || defaultAthlete;

  const playerProfileData = {
    name: athlete?.name,
    img: athlete?.image, // Placeholder image
    grad: athlete?.grad,
    position: athlete?.position,
    state: athlete?.state,
    school: athlete?.school,
    height: athlete?.height,
    weight: athlete?.weight || "0.0",
    gpa: athlete?.gpa || "0.0",
    collegeCommitment: athlete?.commitment || "N/A",
    statusTags: athlete?.statusTags || [],

    // Left Column Data
    parents: [
      {
        role: "Mother",
        name: athleteDetail?.family?.motherName || "N/A",
        occupation: athleteDetail?.family?.motherOccupation || "N/A",
        contact: athleteDetail?.family?.motherContact || "--------",
        dob: formatDate(athleteDetail?.family?.motherDob) || "N/A",
      },
      {
        role: "Father",
        name: athleteDetail?.family?.fatherName || "N/A",
        occupation: athleteDetail?.family?.fatherOccupation || "N/A",
        contact: athleteDetail?.family?.fatherContact || "--------",
        dob: athleteDetail?.family?.fatherDob || "N/A",
      },
    ],
    siblings: [
      {
        name: athlete?.family?.siblings?.name || "N/A",
        dob: athlete?.family?.siblings?.dob || "N/A",
        keyInfluences: athlete?.family?.keyInfluences || "N/A",
      },
    ],
    // Right Column Data
    athleticBackground: {
      // otherSports: a,
      activities: athlete?.athleticBackground?.activities || "N/A",
      coachEvaluation: athlete?.athleticBackground?.coachEvaluation || "N/A",
    },
    footballCharacter: {
      piScore: athlete?.footballCharacter?.grade || "N/A",
      text: athlete?.footballCharacter?.summary || "N/A",
    },
    personalCharacter: {
      piScore: athlete?.personalCharacter?.grade || "N/A",
      text: athlete?.personalCharacter?.summary || "N/A",
    },
  };

  const p = playerProfileData;

  // State to control Pop-up/Modal visibility
  const [message, setMessage] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showRequestSent, setShowRequestSent] = useState(false);

  // --- Handlers for the Click Flow ---

  // 1. Triggered by 'Save Profile' button
  const handleSaveProfile = () => {
    setShowSaveSuccess(true);
    // Automatically hide the success popup after a few seconds (e.g., 3 seconds)
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // 2. Triggered by 'Request Updates' button
  const handleRequestUpdates = () => {
    // First, close any other popups
    setShowSaveSuccess(false);
    setShowRequestSent(false);
    // Show the message modal
    setShowSendMessageModal(true);
  };

  // 3a. Triggered by 'Cancel' button in SendMessageModal
  const handleCancelMessage = () => {
    setShowSendMessageModal(false);
  };

  // 3b. Triggered by 'Send' button in SendMessageModal
  const handleSendMessage = () => {
    setShowSendMessageModal(false); // Close the message modal
    setShowRequestSent(true); // Show the 'Request Sent' popup

    // Automatically hide the 'Request Sent' popup after a few seconds (e.g., 3 seconds)
    setTimeout(() => setShowRequestSent(false), 3000);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const response = await axiosinstance.post("/user/athlete/save", {
        athleteId: id,
      });
      if (response?.status === 200) {
        SuccessToast(
          `${athleteDetail?.isSaved ? "Profile UnSaved" : "Profile Saved"}`,
        );
        setShowSaveSuccess(true);
        queryClient.invalidateQueries({
          queryKey: ["atheletesave"],
        });
        refetch();
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.messsage);
    } finally {
      setSaveLoading(false);
    }
  };
  const handleRequestUpdate = async () => {
    setRequestLoading(true);
    try {
      const response = await axiosinstance.post("/user/athlete/request", {
        athleteId: id,
        description: message,
      });
      if (response?.status === 200) {
        SuccessToast(response?.data?.message);
        setMessage("");
        setShowSendMessageModal(false);
        dispatch(
          logActivity({
            title: "Requested Player Info",
            description: "Requested Player Info",
            metaData: {
              type: "RequestedPlayer",
              athleteImg: athleteDetail?.basicInfo?.image,
              athleteName: athleteDetail?.basicInfo?.name,
            },
          }),
        );
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
    } finally {
      setRequestLoading(false);
    }
  };

  const footballScore = athleteDetail?.athlete?.footballPiScore || "";
  const personalScore = athleteDetail?.athlete?.personalPiScore || "";

  // const handleDownloadCSV = () => {
  //   if (!athlete) return;

  //   const data = formatAthleteForCSV(athleteDetail);

  //   const headers = Object.keys(data);
  //   const values = Object.values(data);

  //   const csv = [
  //     headers.join(","),
  //     values.map((v) => `"${v ?? ""}"`).join(","),
  //   ].join("\n");

  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   const url = window.URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `${athleteDetail?.basicInfo?.name}.csv`;
  //   a.click();

  //   window.URL.revokeObjectURL(url);
  // };

  // const handleDownloadPDF = () => {
  //   if (!athleteDetail) return;

  //   const doc = new jsPDF();
  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   const margin = 15;
  //   let yPosition = margin;
  //   const lineHeight = 7;

  //   // Helper function to add text with wrapping
  //   const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
  //     doc.setFontSize(fontSize);
  //     const lines = doc.splitTextToSize(String(text || "N/A"), maxWidth);
  //     doc.text(lines, x, y);
  //     return y + lines.length * lineHeight;
  //   };

  //   // Helper function to add section
  //   const addSection = (title, content = []) => {
  //     doc.setFontSize(12);
  //     doc.setFont(undefined, "bold");
  //     yPosition += 5;
  //     doc.text(title, margin, yPosition);
  //     yPosition += 8;
  //     doc.setFont(undefined, "normal");
  //     doc.setFontSize(10);

  //     content.forEach((item) => {
  //       if (yPosition > pageHeight - margin) {
  //         doc.addPage();
  //         yPosition = margin;
  //       }
  //       yPosition = addWrappedText(
  //         `${item.label}: ${item.value}`,
  //         margin,
  //         yPosition,
  //         pageWidth - 2 * margin,
  //         10,
  //       );
  //       yPosition += 2;
  //     });
  //   };

  //   // ===== HEADER =====
  //   doc.setFontSize(16);
  //   doc.setFont(undefined, "bold");
  //   doc.text(
  //     `${athleteDetail?.basicInfo?.name || "Athlete Profile"}`,
  //     margin,
  //     yPosition,
  //   );
  //   yPosition += 10;

  //   // Profile Summary
  //   doc.setFontSize(10);
  //   doc.setFont(undefined, "normal");
  //   const profileSummary = [
  //     { label: "ID", value: athleteDetail?._id },
  //     { label: "Position", value: athleteDetail?.basicInfo?.position },
  //     { label: "Graduation Year", value: athleteDetail?.basicInfo?.gradYear },
  //     { label: "Height", value: athleteDetail?.basicInfo?.height },
  //     { label: "Weight", value: athleteDetail?.basicInfo?.weight },
  //     { label: "Status", value: athleteDetail?.basicInfo?.status },
  //   ];
  //   addSection("Basic Information", profileSummary);

  //   // ===== CONTACT INFO =====
  //   const contactInfo = [
  //     { label: "Email", value: athleteDetail?.basicInfo?.email || "N/A" },
  //     { label: "Phone", value: athleteDetail?.basicInfo?.phone || "N/A" },
  //     {
  //       label: "Hometown",
  //       value: athleteDetail?.basicInfo?.hometown || "N/A",
  //     },
  //     {
  //       label: "Date of Birth",
  //       value: formatDate(athleteDetail?.basicInfo?.dob) || "N/A",
  //     },
  //     {
  //       label: "High School",
  //       value: athleteDetail?.basicInfo?.schoolName || "N/A",
  //     },
  //     { label: "State", value: athleteDetail?.basicInfo?.state || "N/A" },
  //     {
  //       label: "Committed College",
  //       value: athleteDetail?.basicInfo?.committedCollege?.name || "N/A",
  //     },
  //   ];
  //   addSection("Contact & School Information", contactInfo);

  //   // ===== FAMILY INFORMATION =====
  //   const familyInfo = [
  //     { label: "Mother Name", value: athleteDetail?.family?.motherName },
  //     {
  //       label: "Mother Occupation",
  //       value: athleteDetail?.family?.motherOccupation,
  //     },
  //     {
  //       label: "Mother DOB",
  //       value: formatDate(athleteDetail?.family?.motherDob) || "N/A",
  //     },
  //     { label: "Mother Contact", value: athleteDetail?.family?.motherContact },
  //     { label: "Father Name", value: athleteDetail?.family?.fatherName },
  //     {
  //       label: "Father Occupation",
  //       value: athleteDetail?.family?.fatherOccupation,
  //     },
  //     {
  //       label: "Father DOB",
  //       value: formatDate(athleteDetail?.family?.fatherDob) || "N/A",
  //     },
  //     { label: "Father Contact", value: athleteDetail?.family?.fatherContact },
  //     {
  //       label: "Key Influences",
  //       value: athleteDetail?.family?.keyInfluences || "N/A",
  //     },
  //   ];
  //   addSection("Family Information", familyInfo);

  //   // ===== ATHLETIC INFORMATION =====
  //   const athleticInfo = [
  //     {
  //       label: "Other Sports",
  //       value: athleteDetail?.athlete?.otherSports || "N/A",
  //     },
  //     {
  //       label: "Activities",
  //       value: athleteDetail?.athlete?.activities || "N/A",
  //     },
  //     {
  //       label: "Coach Evaluation",
  //       value: athleteDetail?.athlete?.coachEvaluation || "N/A",
  //     },
  //   ];
  //   addSection("Athletic Background", athleticInfo);

  //   // ===== CHARACTER SCORES =====
  //   const characterInfo = [
  //     {
  //       label: "Football PI Score",
  //       value: athleteDetail?.athlete?.footballPiScore || "N/A",
  //     },
  //     {
  //       label: "Football Description",
  //       value: athleteDetail?.athlete?.footballDescription || "N/A",
  //     },
  //     {
  //       label: "Personal PI Score",
  //       value: athleteDetail?.athlete?.personalPiScore || "N/A",
  //     },
  //     {
  //       label: "Personal Description",
  //       value: athleteDetail?.athlete?.personalDescription || "N/A",
  //     },
  //   ];
  //   addSection("Character Assessment", characterInfo);

  //   // ===== STRENGTHS & WEAKNESSES =====
  //   const overviewInfo = [
  //     {
  //       label: "Strengths",
  //       value: athleteDetail?.overview?.strengths?.join(", ") || "N/A",
  //     },
  //     {
  //       label: "Weaknesses",
  //       value: athleteDetail?.overview?.weaknesses?.join(", ") || "N/A",
  //     },
  //   ];
  //   addSection("Overview", overviewInfo);

  //   // ===== ADDITIONAL INFO =====
  //   const additionalInfo = [
  //     {
  //       label: "Other Information",
  //       value: athleteDetail?.athlete?.otherInfo || "N/A",
  //     },
  //   ];
  //   addSection("Additional Information", additionalInfo);

  //   // ===== FOOTER =====
  //   if (yPosition > pageHeight - margin) {
  //     doc.addPage();
  //   }
  //   doc.setFontSize(9);
  //   doc.setFont(undefined, "italic");
  //   doc.text(
  //     `Generated on ${new Date().toLocaleDateString()}`,
  //     margin,
  //     pageHeight - 10,
  //   );

  //   // Download PDF
  //   doc.save(`${athleteDetail?.basicInfo?.name || "Athlete_Profile"}.pdf`);
  // };

  const handleDownloadPDF = () => generateAthletePDF(athleteDetail, formatDate);

  const normalizeGrade = (grade) => {
    if (!grade) return null;
    return grade.charAt(0); // A+, A- => A
  };
  const gradeDescriptions = {
    A: "Elite. Has outstanding character with no clear character flaws. Will clearly stand out among his teammates. Strong positive influence. He will likely overcome potential deficiencies due to this outstanding component.",

    B: "Good. Displays solid overall character characteristics. Teammates and coaches will notice his positive traits during normal interactions with this player. Could overcome potential deficiencies in some areas.",

    C: "Adequate/Blend In. Not necessarily a negative, but unlikely to be a positive. Average in all characteristics for the most part. This prospect possesses characteristics to survive and get by.",

    D: "Has a character deficiency. He may display negative character in flashes. May not be fatal character but will likely limit his ability to perform and develop.",

    F: "Fatal characteristics. Will likely fail at the next level and likely to be a distraction to his teammates and coaches.",
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }
  return (
    <div className="w-full min-h-screen bg-[#EAEEF8] font-sans p-4">
      {showSaveSuccess && (
        <SaveSuccessPopup onClose={() => setShowSaveSuccess(false)} />
      )}
      {showRequestSent && (
        <RequestSentPopup onClose={() => setShowRequestSent(false)} />
      )}
      {showSendMessageModal && (
        <SendMessageModal
          onCancel={handleCancelMessage}
          onSend={handleRequestUpdate}
          message={message}
          setMessage={setMessage}
          loading={requestLoading}
        />
      )}

      <div className="mx-auto bg-[#EAEEF8] overflow-hidden">
        <div className="border-gray-200 p-4 md:p-8 flex flex-col md:flex-row items-start">
          <img
            src={athleteDetail?.basicInfo?.image || Emptyimg}
            alt={athleteDetail?.basicInfo?.name}
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full shadow-xl mb-4 md:mb-0 md:mr-6"
          />

          <div className="flex-1 flex flex-col md:flex-row md:justify-between w-full">
            <div className="flex flex-col mb-4 md:mb-0">
              <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 break-words">
                {athleteDetail?.basicInfo?.name}
              </h1>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap gap-3 md:gap-8 mt-3">
                <ProfileStat
                  label="Grad"
                  value={athleteDetail?.basicInfo?.gradYear}
                />
                <ProfileStat
                  label="Position"
                  value={athleteDetail?.basicInfo?.position}
                />
                <ProfileStat
                  label="School"
                  title={athleteDetail?.basicInfo?.schoolName}
                  value={athleteDetail?.basicInfo?.schoolName}
                />
                <ProfileStat
                  label="State"
                  value={athleteDetail?.basicInfo?.state}
                />
                <ProfileStat
                  label="Height"
                  value={`${athleteDetail?.basicInfo?.height}`}
                />
                <ProfileStat
                  label="Weight"
                  value={`${athleteDetail?.basicInfo?.weight} lbs`}
                />
                <ProfileStat
                  label="GPA"
                  value={athleteDetail?.basicInfo?.gpa}
                />

                {/* Commitment */}
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-[14px] md:text-[28px] font-semibold">
                    Committed
                  </span>
                  <div className="flex gap-2 items-center">
                    <img
                      src={
                        athleteDetail?.basicInfo?.committedCollege?.logo ||
                        Emptyimg
                      }
                      alt="College Logo"
                      className="w-[20px] h-[20px] object-contain"
                    />
                    <span className="text-gray-900 text-[11px] md:text-[14px] font-bold">
                      {athleteDetail?.basicInfo?.committedCollege?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-start md:items-end space-y-3 md:ml-6 w-full md:w-auto">
              <div className="flex flex-row space-x-2 sm:space-x-3 w-full md:flex-row">
                <button
                  className="px-4 md:px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 flex-1 sm:flex-none sm:w-auto"
                  onClick={handleSave}
                  disabled={saveLoading}
                >
                  {saveLoading
                    ? "Saving..."
                    : athleteDetail?.isSaved
                      ? "Unsave Profile"
                      : "Save Profile"}
                </button>
                <button
                  className="px-4 py-3 bg-[#0085CA] text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex-1 sm:flex-none sm:w-auto"
                  onClick={handleRequestUpdates}
                >
                  Request Updates
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-4 md:px-6 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 w-full md:w-[270px] h-[50px] justify-center"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mx-4 md:mx-10">
          {athleteDetail?.basicInfo?.status?.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1">
              {athleteDetail?.basicInfo?.status?.map((tag, idx) => {
                const colors = [
                  { bg: "#FF3A44", text: "#fff" },
                  { bg: "#3FB185", text: "#fff" },
                  { bg: "#7A4D8B", text: "#fff" },
                ];

                const color = colors[idx % colors.length];

                return (
                  <span
                    key={idx}
                    className="py-1 px-2 text-[10px] rounded-full font-semibold"
                    style={{
                      border: `1px solid ${color.bg}`,
                      color: "black",
                    }}
                  >
                    {tag.toUpperCase()}
                  </span>
                );
              })}
            </div>
          ) : (
            <span className="py-1 px-2 text-[10px] rounded-full bg-gray-200 text-gray-500 font-semibold">
              N/A
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="flex space-x-2  p-4">
          {p?.statusTags?.map((tag, index) => {
            const styleMap = {
              Rookie: { border: "border-[#7A4D8B]", dot: "bg-[#7A4D8B]" },
              Transfer: { border: "border-green-700", dot: "bg-green-700" },
              Injuries: { border: "border-red-700", dot: "bg-red-700" },
              default: { border: "border-gray-400", dot: "bg-gray-400" },
            };

            const { border, dot } = styleMap[tag] || styleMap.default;

            return (
              <span
                key={index}
                className={`flex items-center px-3 py-3 text-xs font-semibold rounded-full border text-black ${border}`}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${dot}`} />
                {tag}
              </span>
            );
          })}
        </div>

        <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
          <div className="w-full xl:w-[35%] bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white xl:mr-0">
            <div className="space-y-4">
              <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white mb-4">
                <h2 className="flex items-center text-lg font-bold text-red-500">
                  <FaHeart className="mr-2 text-xl" />
                  <p className="text-black">Parents</p>
                </h2>
                {p?.parents?.map((parent, index) => (
                  <div
                    key={index}
                    className="border-b last:border-b-0 pb-3 last:pb-0"
                  >
                    <h4 className="font-bold text-gray-800 mb-1 mt-4">
                      {parent.role}
                    </h4>
                    <InfoRow label="Name" value={parent.name} isBold={true} />
                    <InfoRow label="Occupation" value={parent.occupation} />
                    <InfoRow
                      label="Contact"
                      value={`${parent.contact ? `+1 ${parent.contact}` : "N/A"}`}
                    />
                    <InfoRow label="DOB" value={formatDate(parent.dob)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white mb-4">
                <h2 className="flex items-center text-lg font-bold text-blue-500">
                  <FaUser className="mr-2 text-xl" />
                  <p className="text-black">Siblings</p>
                </h2>
                {athleteDetail?.family?.siblings?.map((sibling, index) => (
                  <div
                    key={index}
                    className="py-1 border-b last:border-b- mt-4"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800 text-sm">
                        {sibling?.type}
                      </span>
                      <span className="font-medium text-gray-800 text-sm">
                        {sibling?.name}
                      </span>
                    </div>
                    <div className="flex justify-between my-4">
                      <span className="font-medium text-gray-800 text-sm">
                        DOB
                      </span>
                      <span className="text-gray-600 text-sm">
                        {formatDate(sibling?.dob)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white">
                <h2 className="flex items-center text-lg font-bold text-black">
                  <img src={features} alt="Features" className="mr-2 text-xl" />
                  Key Influences
                </h2>
                <p className="text-gray-700 text-sm italic mt-4">
                  {athleteDetail?.family?.keyInfluences}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[65%] p-4 xl:p-8 pt-0 space-y-8 xl:pl-8">
            <AthleticBox
              title="Athletic Background"
              icon={<img src={athletic} alt="icon" className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
                <div className="space-y-4">
                  <div>
                    <div className="flex  justify-between text-gray-700 font-medium mb-1">
                      <span className="mr-2">🏅 Other Sports</span>

                      <div className="flex space-x-2">
                        <span className="px-3 py-1 border-2 border-blue-400 text-black rounded-md text-xs font-medium bg-transparent">
                          {athleteDetail?.athlete?.otherSports}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-gray-700 font-medium mb-1">
                      <span className="mr-2">📉</span> Activities
                    </div>

                    <p className="text-gray-800 text-sm leading-relaxed">
                      {athleteDetail?.athlete?.activities || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white  shadow-sm">
                  <div className="flex items-center text-gray-700 font-medium mb-2">
                    <span className="mr-2">⚡</span> Coach Evaluation
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    {athleteDetail?.athlete?.coachEvaluation || "N/A"}
                  </p>
                </div>
              </div>
            </AthleticBox>

            <InfoBox
              title="Football Character"
              score={athleteDetail?.athlete?.footballPiScore}
              icon={
                <img src={football} alt="Football" className="text-blue-600" />
              }
              scoreColorClass="text-[#0085CA]"
            >
              <p className="text-gray-700 text-sm leading-relaxed">
                {athleteDetail?.athlete?.footballDescription}
              </p>
            </InfoBox>

            <InfoBox
              title="Personal Character"
              score={athleteDetail?.athlete?.personalPiScore}
              icon={
                <img
                  src={personal}
                  alt="personal"
                  className="text-orange-600"
                />
              }
              scoreColorClass="text-[#FFC145]"
            >
              <p className="text-gray-700 text-sm leading-relaxed">
                {athleteDetail?.athlete?.personalDescription}
              </p>
            </InfoBox>

            <InfoBox
              title="Other Relevant Information"
              icon={<img src={other} alt="Other" className="text-[#7A4D8B]" />}
            >
              <p className="text-gray-700 text-sm italic ">
                {athleteDetail?.athlete?.otherInfo || "N/A"}
              </p>
            </InfoBox>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
          Overview
        </h2>

        <div className="bbg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
          <div className="bg-white bg-opacity-25  rounded-xl border-2 border-white  p-8">
            <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
              STRENGTH
            </h2>

            <ul className="space-y-4">
              {athleteDetail?.overview?.strengths &&
              athleteDetail?.overview?.strengths.length > 0 ? (
                athleteDetail?.overview?.strengths.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700 ">
                    <span className="text-blue-600 h-8 mr-3">✦</span>
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No strengths listed.</li>
              )}
            </ul>
          </div>

          <div className="bg-white bg-opacity-25  rounded-xl border-2 border-white  p-8">
            <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
              WEAKNESS
            </h2>

            <ul className="space-y-4">
              {athleteDetail?.overview?.weaknesses &&
              athleteDetail?.overview?.weaknesses.length > 0 ? (
                athleteDetail?.overview?.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    <span className="text-red-500 mr-3">✚</span>
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No weaknesses listed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14 w-full mb-10">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-10">
          Grading Scale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={` ${getGradeColor(footballScore)} text-white p-10 rounded-xl shadow-lg`}
          >
            <div className="flex items-center justify-center mb-4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold p-4 border-2 border-white ${getGradeColor(footballScore)}`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold p-8 border-2 border-white ${getGradeColor(footballScore)}`}
                >
                  {athleteDetail?.athlete?.footballPiScore}
                </div>
              </div>
            </div>

            <h3 className="text-center text-3xl font-bold mb-4">
              Football Character
            </h3>

            <p className="text-center text-sm opacity-90 leading-relaxed">
              {gradeDescriptions[
                normalizeGrade(athleteDetail?.athlete?.footballPiScore)
              ] || athleteDetail?.athlete?.footballDescription}
            </p>
          </div>

          <div
            className={` ${getGradeColor(personalScore)} text-white p-10 rounded-xl shadow-lg`}
          >
            <div className="flex items-center justify-center mb-4">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold p-4 border-2 border-white ${getGradeColor(personalScore)}`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-2xl font-bold p-8 border-2 border-white ${getGradeColor(personalScore)}`}
                >
                  {athleteDetail?.athlete?.personalPiScore}
                </div>
              </div>
            </div>

            <h3 className="text-center text-3xl font-bold mb-4">
              Personal Character
            </h3>

            <p className="text-center text-sm leading-relaxed opacity-90">
              {gradeDescriptions[
                normalizeGrade(athleteDetail?.athlete?.personalPiScore)
              ] || athleteDetail?.athlete?.personalDescription}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-black text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              A
            </div>
            <p className="mt-2 font-semibold text-lg">Elite</p>
            <p className="text-white text-[16px] text-center flex-1">
              Elite. Has outstanding character with no clear character flaws.
              Will clearly stand out amount his teammates. Strong positive
              influence. He will likely overcome potential defeciencies due to
              this outstanding component.
            </p>
          </div>

          <div className="bg-[#1DB863] text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              B
            </div>
            <p className="mt-2 font-semibold text-lg">Good</p>
            <p className="text-white text-[16px] text-center flex-1">
              Good. Displays solid overall character characteristics. Teammates
              and coaches will notice his positive traits during normal
              interactions with this player. Could overcome potential
              defeciencies in some areas.
            </p>
          </div>

          <div className="bg-[#B5B5B5] text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              C
            </div>
            <p className="mt-2 font-semibold text-lg">Adequate/Blend In</p>
            <p className="text-white text-[16px] text-center flex-1 ">
              Adequate/Blend In. Not necessarily a negative, but unlikely to be
              a positive. Average in all characteristics for the most part. This
              prospect possesses characteristics to survive and get by. He will
              not add or subtract to the culture. This will be the bulk of
              prospects.
            </p>
          </div>

          <div className="bg-[#F9C933] text-black rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-black text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              D
            </div>
            <p className="mt-2 font-semibold text-lg">Character Deficiency</p>
            <p className="text-black text-[16px] text-center flex-1">
              Has a character defeciency. He may display negative character in
              flashes. May not be fatal character but will likely limit his
              ability to perform and develop. Teammates and coaches will notice
              defeciencies.
            </p>
          </div>

          <div className="bg-[#FF3A3A] text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              F
            </div>
            <p className="mt-2 font-semibold text-lg">Fatal Characteristics</p>
            <p className="text-white text-[16px] text-center flex-1">
              Fatal characteristics. Will likely fail at the next level and
              likely to be a distraction to his teammates and coaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
