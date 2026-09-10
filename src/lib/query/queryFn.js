import axiosinstance from "../../axios";

export const getAthlete = async ({
  page = 1,
  itemsPerPage = 10,
  search,
  selectedPosition,
  personalPiScore,
  footballPiScore,
  SchoolId,
  selectedGradeYear,
  isActive,
  selectedCity,
  selectedState,
  sortBy,
  sortOrder,
}) => {
  let url = `/athlete/user/list?page=${page}&limit=${itemsPerPage}&search=${search}&position=${selectedPosition}&personalPiScore=${personalPiScore}&footballPiScore=${footballPiScore}&school=${SchoolId}&gradYear=${selectedGradeYear}&active=${isActive}&state=${selectedState}&city=${selectedCity}`;
  if (sortBy) {
    url += `&sortBy=${encodeURIComponent(sortBy)}`;
  }
  if (sortOrder) {
    url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
  }
  const res = await axiosinstance.get(url);
  return res.data;
};
export const getSchool = async ({
  page = 1,
  itemsPerPage = 10,
  searchTerm,
  sort = false,
}) => {
  let url = `/school?page=${page}&limit=${itemsPerPage}&search=${searchTerm}&sortBy=name&sortOrder=asc`;

  // if (sort) {
  //   url += `&sortBy=name&sortOrder=asc`;
  // }

  const res = await axiosinstance.get(url);
  return res.data;
};

export const getAtheleteById = async (id) => {
  const res = await axiosinstance.get(`/athlete/${id}`);
  return res.data.data;
};
export const getAtheleteSave = async ({
  page = 1,
  itemsPerPage = 10,
  search = "",
  sortBy,
  sortOrder,
} = {}) => {
  let url = `/user/athlete/save?page=${page}&limit=${itemsPerPage}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (sortBy) {
    url += `&sortBy=${encodeURIComponent(sortBy)}`;
  }
  if (sortOrder) {
    url += `&sortOrder=${encodeURIComponent(sortOrder)}`;
  }
  const res = await axiosinstance.get(url);
  return res.data;
};
export const getProfile = async () => {
  const res = await axiosinstance.get(`/user/me`);
  return res.data.data;
};
export const getNotification = async ({ page = 1, itemsPerPage = 10 }) => {
  const res = await axiosinstance.get(
    `/notification/me?page=${page}&limit=${itemsPerPage}`,
  );
  return res.data;
};
export const getNotificationCount = async () => {
  const res = await axiosinstance.get(`/notification/count`);
  return res.data.data;
};
