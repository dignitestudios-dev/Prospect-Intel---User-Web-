import axiosinstance from "../../../axios";

const activityMiddleware = (store) => (next) => async (action) => {
  if (action.type === "activity/logActivity") {
    const state = store.getState();

    try {
      await axiosinstance.post("/user/activity", {
        ...action.payload,
      });
    } catch (error) {
      console.log("Activity Error:", error);
    }
  }

  return next(action);
};

export default activityMiddleware;
