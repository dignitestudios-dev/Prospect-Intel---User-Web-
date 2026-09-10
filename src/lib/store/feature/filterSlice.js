import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

export const initialFilterState = {
  page: 1,
  itemsPerPage: 10,
  schoolPage: 1,
  search: "",
  selectedPosition: "",
  personalPiScore: "",
  footballPiScore: "",
  selectedSchool: null,
  selectedGradeYear: "",
  selectedState: "",
  selectedCity: "",
  status: "active",
  searchTerm: "",
  sortByName: false,
};

const loadStoredFilters = () => {
  if (typeof window === "undefined") return initialFilterState;
  try {
    const saved = sessionStorage.getItem("athlete_filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialFilterState, ...parsed };
    }
  } catch (e) {
    console.error("Error loading filters from sessionStorage:", e);
  }
  return initialFilterState;
};

const filterSlice = createSlice({
  name: "filters",
  initialState: loadStoredFilters(),
  reducers: {
    setFilters: (state, action) => {
      const updated = { ...state, ...action.payload };
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("athlete_filters", JSON.stringify(updated));
        } catch (e) {
          console.error("Error saving filters to sessionStorage:", e);
        }
      }
      return updated;
    },
    resetFilters: () => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("athlete_filters");
        } catch (e) {}
      }
      return initialFilterState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("athlete_filters");
        } catch (e) {}
      }
      return initialFilterState;
    });
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
