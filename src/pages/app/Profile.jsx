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
} from "../../assets/export";
import {
  SaveSuccessPopup,
  RequestSentPopup,
  SendMessageModal,
} from "../../components/PopupComponents";
import { useParams } from "react-router";
import { mockAtheleTableData } from "../../static/mockData";

// --- END DUMMY DATA ---

// Helper component for the Profile Header Stats (Grad, Position, Height, etc.)
const ProfileStat = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-gray-500 text-[28px] font-semibold">{label}</span>
    <span className="text-gray-900 text-[14px] font-bold">{value}</span>
  </div>
);

// Helper component for the Info Boxes on the right side
const InfoBox = ({
  title,
  score,
  icon,
  children,
  scoreColorClass = "text-blue-600",
}) => (
  <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white">
    <div className="flex justify-between items-center mb-4">
      <h3 className="flex items-center p-2 pb-0 text-xl font-bold text-gray-800">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {score && (
        <div
          className={`flex items-center border border-gray-300 rounded-lg p-2 ${score === "A" ? "bg-[#131212]" : "bg-[#909090]"
            }`}
        >
          <span className="text-xs font-semibold text-white mr-2">
            PI Score
          </span>
          <span className="text-xl font-bold text-white">
            {score}
          </span>
        </div>
      )}

    </div>
    <div className="p-6 rounded-xl shadow-sm mb-6 border-2 border-white">
      <div>{children}</div>
    </div>
  </div>
);

// Helper component for Parent/Sibling rows
const InfoRow = ({ label, value, isBold = false }) => (
  <div className="flex justify-between py-1">
    <span className="text-gray-600 text-sm">{label}:</span>
    <span
      className={`text-gray-900 text-sm ${isBold ? "font-semibold" : "font-normal"
        }`}
    >
      {value}
    </span>
  </div>
);
const AthleticBox = ({ title, icon, children }) => (
  <div className="bg-white bg-opacity-25  pt-4  border-2 border-white rounded-2xl p-5">
    {/* HEADER */}

    {/* INNER CONTENT */}
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
  const athlete = mockAtheleTableData.find(a => a.id === id);
  // --- DUMMY DATA STRUCTURE TO MATCH IMAGE CONTENT ---
  const playerProfileData = {
    name: athlete?.name,
    img: athlete?.image, // Placeholder image
    grad: athlete.grad,
    position: athlete.position,
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
        name: athlete.family.mother.name || "N/A",
        occupation: athlete.family.mother.occupation || "N/A",
        contact: athlete.family.mother.phone || "--------",
        dob: athlete.family.mother.dob || "N/A",
      },
      {
        role: "Father",
        name: athlete.family.father.name || "N/A",
        occupation: athlete.family.father.occupation || "N/A",
        contact: athlete.family.father.phone || "--------",
        dob: athlete.family.father.dob || "N/A",
      },
    ],
    siblings: [
      { name: athlete.family.siblings?.name || "N/A", dob: athlete.family.siblings?.dob || "N/A" },

    ],
    keyInfluences:
      athlete.family.keyInfluences || "N/A",

    // Right Column Data
    athleticBackground: {
      // otherSports: a,
      activities: athlete.athleticBackground.activities || "N/A",
      coachEvaluation:
        athlete.athleticBackground.coachEvaluation || "N/A",
    },
    footballCharacter: {
      piScore: athlete.footballCharacter.grade || "N/A",
      text: athlete.footballCharacter.summary || "N/A",
    },
    personalCharacter: {
      piScore: athlete.personalCharacter.grade || "N/A",
      text: athlete.personalCharacter.summary || "N/A",
    },
  };
  const p = playerProfileData;

  // State to control Pop-up/Modal visibility
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
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

  return (
    // Main container matching the light gray background of the image
    <div className="w-full min-h-screen bg-[#EAEEF8] font-sans p-4">
      {/* Conditional Popups/Modals */}
      {showSaveSuccess && (
        <SaveSuccessPopup onClose={() => setShowSaveSuccess(false)} />
      )}
      {showRequestSent && (
        <RequestSentPopup onClose={() => setShowRequestSent(false)} />
      )}
      {showSendMessageModal && (
        <SendMessageModal
          onCancel={handleCancelMessage}
          onSend={handleSendMessage}
        />
      )}

      {/* White Card Container */}
      <div className="mx-auto bg-[#EAEEF8] overflow-hidden">
        {/* --- Top Header Section --- */}
        <div className="border-gray-200 p-8 flex items-start">
          {/* Profile Picture */}
          <img
            src={p.img}
            alt={p.name}
            className="w-[100px] h-[100px] rounded-full shadow-xl mr-6"
          />

          {/* Main content area */}
          <div className="flex-1 flex justify-between">
            {/* LEFT: Name + Stats */}
            <div className="flex flex-col">
              {/* Name */}
              <h1 className="text-3xl font-extrabold text-gray-900">
                {p.name}
              </h1>

              {/* Stats (all on one line) */}
              <div className="flex gap-8 mt-3 whitespace-nowrap overflow-x-auto">
                <ProfileStat label="Grad" value={p.grad} />
                <ProfileStat label="Position" value={p.position} />
                <ProfileStat label="School" value={p.school} />
                <ProfileStat label="State" value={p.state} />

                <ProfileStat label="Height" value={p.height} />
                <ProfileStat label="Weight" value={p.weight} />
                <ProfileStat label="GPA" value={p.gpa} />
                <ProfileStat label="Commitment" value={p.collegeCommitment} />
              </div>
            </div>

            {/* RIGHT: Buttons */}
            <div className="flex flex-col items-end space-y-3 ml-6">
              {/* Save + Request row */}
              <div className="flex space-x-3">
                <button
                  className="px-6 py-3 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                  onClick={handleSaveProfile}
                >
                  Save Profile
                </button>
                <button
                  className="px-4 py-3 bg-[#0085CA] text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                  onClick={handleRequestUpdates}
                >
                  Request Updates
                </button>
              </div>

              {/* Download button below */}
              <button className="flex items-center px-6 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 w-[270px] h-[50px] justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt="pdf icon"
                  className="w-5 h-5 mr-2"
                />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* --- Stats Row Section --- */}

        <div className="flex space-x-2  p-4">
          {p.statusTags.map((tag, index) => {
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
                {/* Colored Dot */}
                <span className={`w-2 h-2 rounded-full mr-2 ${dot}`} />
                {tag}
              </span>
            );
          })}
        </div>

        {/* --- Main Content: Two Columns --- */}
        <div className="flex divide-x divide-gray-100">
          {/* Left Column: Family & Influences (Approx 30%) */}
          <div className="w-[35%] bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white">
            {/* Parents Section */}
            <div className="space-y-4">
              <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white mb-4">
                <h2 className="flex items-center text-lg font-bold text-red-500">
                  <FaHeart className="mr-2 text-xl" />
                  <p className="text-black">Parents</p>
                </h2>
                {p.parents.map((parent, index) => (
                  <div
                    key={index}
                    className="border-b last:border-b-0 pb-3 last:pb-0"
                  >
                    <h4 className="font-bold text-gray-800 mb-1 mt-4">
                      {parent.role}
                    </h4>
                    <InfoRow label="Name" value={parent.name} isBold={true} />
                    <InfoRow label="Occupation" value={parent.occupation} />
                    <InfoRow label="Contact" value={parent.contact} />
                    <InfoRow label="DOB" value={parent.dob} />
                  </div>
                ))}
              </div>
            </div>

            {/* Siblings Section */}
            <div className="space-y-4">
              <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white mb-4">
                <h2 className="flex items-center text-lg font-bold text-blue-500">
                  <FaUser className="mr-2 text-xl" />
                  <p className="text-black">Siblings</p>
                </h2>
                {p.siblings.map((sibling, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-1 border-b last:border-b- mt-4"
                  >
                    <span className="font-medium text-gray-800 text-sm">
                      {sibling.name}
                    </span>
                    <span className="text-gray-600 text-sm">{sibling.dob}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Influences Section */}
            <div className="space-y-4">
              <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white">
                <h2 className="flex items-center text-lg font-bold text-black">
                  <img src={features} alt="Features" className="mr-2 text-xl" />
                  Key Influences
                </h2>
                <p className="text-gray-700 text-sm italic mt-4">
                  {p.keyInfluences}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Character Profiles (Approx 65%) */}
          <div className="w-[65%] p-8 pt-0 space-y-8 ">
            {/* Athletic Background */}
            <AthleticBox
              title="Athletic Background"
              icon={<img src={athletic} alt="icon" className="w-5 h-5" />}
            >
              <div className="grid grid-cols-2 gap-10">
                {/* LEFT SECTION */}
                <div className="space-y-4">
                  {/* Other Sports */}
                  <div>
                    <div className="flex  justify-between text-gray-700 font-medium mb-1">
                      <span className="mr-2">🏅 Other Sports</span>

                      <div className="flex space-x-2">
                        {athlete?.athleticBackground?.otherSports?.length > 0 ? (
                          athlete.athleticBackground.otherSports.map((sport, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 border-2 border-blue-400 text-black rounded-md text-xs font-medium bg-transparent"
                            >
                              {sport}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <div className="flex items-center text-gray-700 font-medium mb-1">
                      <span className="mr-2">📉</span> Activities
                    </div>

                    <p className="text-gray-800 text-sm leading-relaxed">
                      {p.athleticBackground.activities || "N/A"}
                    </p>
                  </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="bg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white  shadow-sm">
                  <div className="flex items-center text-gray-700 font-medium mb-2">
                    <span className="mr-2">⚡</span> Coach Evaluation
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    {p.athleticBackground.coachEvaluation || "N/A"}
                  </p>
                </div>
              </div>
            </AthleticBox>

            {/* Football Character */}
            <InfoBox
              title="Football Character"
              score={p.footballCharacter.piScore}
              icon={
                <img src={football} alt="Football" className="text-blue-600" />
              }
              scoreColorClass="text-[#0085CA]"
            >
              <p className="text-gray-700 text-sm leading-relaxed">
                {p.footballCharacter.text}
              </p>
            </InfoBox>

            <InfoBox
              title="Personal Character"
              score={p.personalCharacter.piScore}
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
                {p.personalCharacter.text}
              </p>
            </InfoBox>

            <InfoBox
              title="Other Relevant Information"
              icon={<img src={other} alt="Other" className="text-[#7A4D8B]" />}
            >
              <p className="text-gray-700 text-sm italic ">
                {athlete.otherRelevantInfo.summary || "N/A"}
              </p>
            </InfoBox>
          </div>
        </div>
      </div>
      {/* ================= OVERVIEW ================= */}
      <div className="mt-10 w-full">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
          Overview
        </h2>

        <div className="bbg-white bg-opacity-25 p-4 pt-4 rounded-xl border-2 border-white grid grid-cols-2 gap-10">
          {/* ---------- Strength Box ---------- */}
          <div className="bg-white bg-opacity-25  rounded-xl border-2 border-white  p-8">
            <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
              STRENGTH
            </h2>

            <ul className="space-y-4">
              {athlete?.strengths && athlete.strengths.length > 0 ? (
                athlete.strengths.map((item, i) => (
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

          {/* ---------- Weakness Box ---------- */}
          <div className="bg-white bg-opacity-25  rounded-xl border-2 border-white  p-8">
            <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-6">
              WEAKNESS
            </h2>

            <ul className="space-y-4">
              {athlete?.weaknesses && athlete.weaknesses.length > 0 ? (
                athlete.weaknesses.map((item, i) => (
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
      {/* ================= ACHIEVEMENTS ================= */}
      <div className="mt-14 w-full mb-10">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-10">
          Grading Scale
        </h2>

        {/* Top Two Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Football Character */}
          <div className="bg-[#0F0F0F] text-white p-10 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg border-white/50 text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
                {athlete?.footballCharacter.grade || "N/A"}
              </div>
            </div>

            <h3 className="text-center text-3xl font-bold mb-4">
              Football Character
            </h3>

            <p className="text-center text-sm opacity-90 leading-relaxed">
              {athlete.footballCharacter.summary || "N/A"}
            </p>
          </div>

          {/* Personal Character */}
          <div className="bg-[#909090] text-white p-10 rounded-xl shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
                {athlete?.personalCharacter.grade || "N/A"}
              </div>
            </div>

            <h3 className="text-center text-3xl font-bold mb-4">
              Personal Character
            </h3>

            <p className="text-center text-sm leading-relaxed opacity-90">
              {athlete.personalCharacter.summary || "N/A"}

            </p>
          </div>
        </div>

        {/* Bottom 5 Grading Boxes */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* A */}
          <div className="bg-black text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              A
            </div>
            <p className="mt-2 font-semibold text-lg">Elite</p>
            <p className="text-white text-[16px] text-center">
              ------
            </p>
          </div>

          {/* B */}
          <div className="bg-[#1DB863] text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              B
            </div>
            <p className="mt-2 font-semibold text-lg">Good</p>
            <p className="text-white text-[16px] text-center">
              ---
            </p>
          </div>

          {/* C */}
          <div className="bg-[#B5B5B5] text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              C
            </div>
            <p className="mt-2 font-semibold text-lg">Adequate/Blend In</p>
            <p className="text-white text-[16px] text-center">
              ---
            </p>
          </div>

          {/* D */}
          <div className="bg-[#F9C933] text-black rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-black text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              D
            </div>
            <p className="mt-2 font-semibold text-lg">Character Deficiency</p>
            <p className="text-black text-[16px] text-center">
              ---
            </p>
          </div>

          {/* F */}
          <div className="bg-[#FF3A3A] text-white rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center  border-white/40 rounded-lg  text-white text-2xl font-bold bg-transparent bg-opacity-25 p-4 pt-4  border-2 border-white">
              F
            </div>
            <p className="mt-2 font-semibold text-lg">Fatal Characteristics</p>
            <p className="text-white text-[16px] text-center">
              ---
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
