import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import axiosinstance from "../../axios";
import { useAppDispatch } from "../../lib/store/hook";
import { logActivity } from "../../lib/store/actions/activityActions";
import { ErrorToast, SuccessToast } from "../global/Toaster";

/**
 * Opens an athlete profile and logs the view (same activity record as before).
 * The ids of the current result page travel with the navigation so the profile
 * can offer Previous / Next without going back to the list.
 */
export const useOpenAthlete = (athletes = []) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useCallback(
    (p) => {
      if (!p?._id) return;
      dispatch(
        logActivity({
          title: "Opened Player Profile",
          description: "Opened Player Profile",
          metaData: {
            type: "ProfileView",
            athleteImg: p.basicInfo?.image,
            athleteName: p?.basicInfo?.name,
          },
        }),
      );
      queryClient.invalidateQueries({ queryKey: ["atheleteid", p?._id] });
      navigate(`/app/profile/${p?._id}`, {
        state: {
          list: athletes
            .filter((a) => a?._id)
            .map((a) => ({ id: a._id, name: a.basicInfo?.name, image: a.basicInfo?.image })),
        },
      });
    },
    [athletes, dispatch, navigate, queryClient],
  );
};

/** Save / unsave a single athlete (the endpoint toggles). */
export const useToggleSave = () => {
  const queryClient = useQueryClient();
  const [savingId, setSavingId] = useState(null);

  const toggle = useCallback(
    async (id, { wasSaved } = {}) => {
      setSavingId(id);
      try {
        const res = await axiosinstance.post("/user/athlete/save", { athleteId: id });
        if (res.status === 200 || res.status === 201) {
          SuccessToast(res.data?.message || (wasSaved ? "Removed from Saved" : "Saved"));
          queryClient.invalidateQueries({ queryKey: ["athlete"] });
          queryClient.invalidateQueries({ queryKey: ["atheletesave"] });
          queryClient.invalidateQueries({ queryKey: ["atheleteid", id] });
        }
      } catch (err) {
        ErrorToast(
          err?.response?.data?.message ||
            err?.response?.data?.messsage ||
            "Couldn't update Saved. Try again.",
        );
      } finally {
        setSavingId(null);
      }
    },
    [queryClient],
  );

  return { toggle, savingId };
};

/** Bulk save / unsave for the current selection. */
export const useBulkSave = ({ onDone } = {}) => {
  const queryClient = useQueryClient();
  const [bulkLoading, setBulkLoading] = useState(false);

  const run = useCallback(
    async (athleteIds, action) => {
      if (!athleteIds || athleteIds.length === 0) {
        ErrorToast("Select at least one athlete first.");
        return;
      }
      setBulkLoading(true);
      try {
        const res = await axiosinstance.post("/user/athlete/save/bulk", { athleteIds, action });
        if (res.status === 200 || res.status === 201) {
          SuccessToast(
            res.data?.message || (action === "save" ? "Athletes saved" : "Athletes removed from Saved"),
          );
          queryClient.invalidateQueries({ queryKey: ["athlete"] });
          queryClient.invalidateQueries({ queryKey: ["atheletesave"] });
          onDone?.();
        }
      } catch (err) {
        ErrorToast(
          err?.response?.data?.message ||
            err?.response?.data?.messsage ||
            (action === "save" ? "Couldn't save those athletes." : "Couldn't update Saved."),
        );
      } finally {
        setBulkLoading(false);
      }
    },
    [queryClient, onDone],
  );

  return { run, bulkLoading };
};
