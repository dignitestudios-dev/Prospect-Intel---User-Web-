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
}) => {
  const res = await axiosinstance.get(
    `/athlete/user/list?page=${page}&limit=${itemsPerPage}&search=${search}&position=${selectedPosition}&personalPiScore=${personalPiScore}&footballPiScore=${footballPiScore}&school=${SchoolId}&gradYear=${selectedGradeYear}&active=${isActive}&state=${selectedState}&city=${selectedCity}`,
  );
  return res.data;
};
export const getSchool = async ({ schoolPage = 1, itemsPerPage = 10 }) => {
  const res = await axiosinstance.get(
    `/school?page=${schoolPage}&limit=${itemsPerPage}`,
  );
  return res.data;
};

export const getAtheleteById = async (id) => {
  const res = await axiosinstance.get(`/athlete/${id}`);
  return res.data.data;
};
export const getAtheleteSave = async () => {
  const res = await axiosinstance.get(`/user/athlete/save`);
  return res.data.data;
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
