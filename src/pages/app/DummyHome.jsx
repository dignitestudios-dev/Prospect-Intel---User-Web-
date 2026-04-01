import { useEffect, useState } from "react";
import { FaPrint, FaDownload, FaSearch } from "react-icons/fa";
import ArchivedTable from "../../components/ArchivedTable";
import { textOne, textThree, textTwo } from "../../assets/export";
import ActiveFilters from "../../components/home/ActiveFilters";
import { getAthlete, getSchool } from "../../lib/query/queryFn";
import { useQuery } from "@tanstack/react-query";
import citiesData from "../../static/us";
import { logActivity } from "../../lib/store/actions/activityActions";
import useDebounce, { useAppDispatch } from "../../lib/store/hook";




const positions = [
  "Quarterback",
  "Running Back",
  "Wide Receiver",
  "Tight End",
  "Offensive Line",
  "Defensive Line",
  "Linebacker",
  "Defensive Back",
  "Athlete",
  "Specialist"
];



const gradYearPills = [
  { label: "2027" },
  { label: "2028" },
  { label: "2029" },
  { label: "2030" },
  { label: "2031" },
  { label: "2032" },
];

const personalCharacters = [
  { label: "A" },


  { label: "B" },


  { label: "C" },


  { label: "D" },


  { label: "F" },

  { label: "N/A" },
];

const footballCharacters = [

  { label: "A" },


  { label: "B" },


  { label: "C" },


  { label: "D" },


  { label: "F" },

  { label: "N/A" },
];
export const locationData = {
  Colorado: ["Denver", "Boulder", "Aurora"],
  Texas: ["Houston", "Dallas", "Austin"]
};
const DummyHome = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1)
  const [schoolPage, setSchoolPage] = useState(1)
  const [search, setSearch] = useState("")
  const [isArchived, setIsArchived] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [personalPiScore, setPersonalPiScore] = useState('')
  const [footballPiScore, setFootBallPiScore] = useState('')
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedGradeYear, setSelectedGradeYear] = useState('')
  const SchoolId = selectedSchool?.id || ""
  const [status, setStatus] = useState(null);
  const isActive = status === "active" ? true : status === "inactive" ? false : "";
  const debouncedSearch = useDebounce(search, 500)



  const { data, isLoading, } = useQuery({
    queryKey: ["athlete", page, search, selectedPosition, personalPiScore, footballPiScore, SchoolId, selectedGradeYear, status, selectedCity, selectedState],
    queryFn: () => getAthlete({ page, search: debouncedSearch, selectedPosition, personalPiScore, footballPiScore, SchoolId, selectedGradeYear, isActive, selectedCity, selectedState }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,

  });


  useEffect(() => {
    const filters = {
      search,
      position: selectedPosition,
      personalPiScore,
      footballPiScore: footballPiScore?.label,
      school: selectedSchool?.name || "",
      gradYear: selectedGradeYear,
      state: selectedState,
      city: selectedCity,
      status,
    };

    const appliedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );

    if (Object.keys(appliedFilters).length > 0) {
      dispatch(
        logActivity({

          title: "Filter Applied",
          description: "User applied filters",
          metaData: {
            type: "Filters",
            filter: appliedFilters
          },
        })
      );
    }
  }, [
    search,
    selectedPosition,
    personalPiScore,
    footballPiScore,
    selectedSchool,
    selectedGradeYear,
    selectedState,
    selectedCity,
    status,
  ]);


  const { data: schools, isLoading: schoolLoading, } = useQuery({
    queryKey: ["school", schoolPage],
    queryFn: () => getSchool({ schoolPage }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,

  });

  const handleClearAll = () => {
    setSelectedPosition('');
    setPersonalPiScore('');
    setFootBallPiScore('');
    setSelectedGradeYear('')
    setSelectedCity('')
    setSelectedState('')
    setSelectedSchool(null);
    setSchoolPage(1);
    setSearch('');
    setStatus(null)
    setPage(1);
  };
  useEffect(() => {
    if (selectedState) {
      setCities(citiesData[selectedState] || []);
    } else {
      setCities([]);
    }
    setSelectedCity("");
  }, [selectedState]);


  return (
    <div className="w-full min-h-screen h-full bg-[#F5F7FB] flex justify-center items-start font-sans ">
      <div className="w-full h-full bg-[#EAEEF8] border-2 border-gray-100 mb-2 overflow-auto">
        <div className="p-6 flex justify-between items-center">
          {/* Header Content */}
          <div className="flex items-center gap-4 ">
            <div className="relative ">
              <FaSearch className="absolute shadow-xl left-4 top-1/2 -translate-y-1/2 text-black text-lg" />
              <input
                type="text"
                placeholder="Search for players"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[380px] font-thin h-[50px] pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 text-sm shadow-sm"
              />
            </div>
            <div>
              <p className="cursor-pointer text-[#0085CA] font-medium">
                Advanced Filters
              </p>
            </div>
          </div>

          {/* Right Side Header Buttons and Account */}
          <div className="flex items-center space-x-20 border-gray-200 pl-2 ">

            {!isArchived && (
              <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 border border-white bg-[#EAEEF8] rounded-lg text-gray-700 text-sm shadow-sm hover:bg-gray-50 transition-colors">
                  <FaPrint className="mr-2 text-xs" />
                  Print
                </button>
                <button className="flex items-center px-4 py-2 border border-white bg-[#EAEEF8] text-gray-700 rounded-lg text-sm shadow shadow-blue-200 hover:bg-gray-50 transition-colors">
                  <FaDownload className="mr-2 text-xs" />
                  Download Pdf
                </button>
              </div>
            )}

            {/* RIGHT SIDE: Active / Archived Toggle */}
            <div className="flex items-center">
              <div className="flex border border-white bg-[#EAEEF8] rounded-lg overflow-hidden shadow-sm p-1">

                {/* Active */}
                <button
                  className={`px-10 py-2 rounded-lg text-sm font-medium ${status === "active"
                    ? "bg-white border-2 border-gray-300 text-black"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setStatus("active")}
                >
                  Active
                </button>

                {/* Archived */}
                <button
                  className={`px-6 py-2 rounded-lg text-sm font-medium ${status === "inactive"
                    ? "bg-white border-2 border-gray-300 text-black"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                  onClick={() => setStatus("inactive")}
                >
                  Archived
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area: Table and Filters */}
        <div className="flex">
          {/* Left Side: Table & Results */}
          <div className="flex-grow p-6 pt-4 border-2 border-r border-gray-100 max-w-[calc(100%-300px)]">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {data?.data?.length} Results
            </h3>


            <ArchivedTable players={data?.data} pagination={data?.pagination} loading={isLoading} setPage={setPage} />

          </div>



          <ActiveFilters
            positionPills={positions}
            personalCharacters={personalCharacters}
            footballCharacters={footballCharacters}
            gradYearPills={gradYearPills}
            textOne={textOne}
            textTwo={textTwo}
            textThree={textThree}
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            setPersonalPiScore={setPersonalPiScore}
            setFootBallPiScore={setFootBallPiScore}
            schools={schools}
            setSelectedSchool={setSelectedSchool}
            selectedSchool={selectedSchool}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setSchoolPage={setSchoolPage}
            schoolLoading={schoolLoading}
            handleClearAll={handleClearAll}
            setSelectedGradeYear={setSelectedGradeYear}
            selectedGradeYear={selectedGradeYear}
            cities={cities}
            selectedCity={selectedCity}
            setSelectedState={setSelectedState}
            selectedState={selectedState}
            setSelectedCity={setSelectedCity}
            personalPiScore={personalPiScore}
            footballPiScore={footballPiScore}
          />



          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default DummyHome;
