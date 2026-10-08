import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getProfile } from "../../lib/query/queryFn";
import { formatDate } from "../../lib/helpers";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../../components/global/Toaster";
import { useAppDispatch } from "../../lib/store/hook";
import { login } from "../../lib/store/feature/authSlice";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import { TextField } from "../../ui/Field";
import { Skeleton } from "../../components/global/Skeleton";
import { cn } from "../../ui/cn";

const daysUntil = (end) => {
  if (!end) return null;
  const ms = new Date(end).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86400000));
};

function Row({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4">
      <dt className="text-[13px] text-ink-500">{label}</dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const [saveLoading, setSaveLoading] = useState(false);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profileMe"],
    queryFn: getProfile,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  // Start the field from the saved name; editing never snaps back.
  useEffect(() => {
    if (data?.name !== undefined) setName(data.name);
  }, [data?.name]);

  const trimmed = name.trim();
  const changed = trimmed !== (data?.name || "");
  const nameError = touched && trimmed.length < 2 ? "Enter at least 2 characters." : "";

  const handleUpdate = async (e) => {
    e?.preventDefault();
    setTouched(true);
    if (trimmed.length < 2 || !changed) return;
    setSaveLoading(true);
    try {
      const response = await axiosinstance.put("/user/update/name", { name: trimmed });
      if (response?.status === 200) {
        SuccessToast(response?.data?.message || "Name updated");
        const updatedUser = response?.data?.data;
        dispatch(login({ token: Cookies.get("userToken"), user: updatedUser }));
        setTouched(false);
        refetch();
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message || "Couldn't update your name. Try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const left = daysUntil(data?.subscriptionEndDate);
  const ending = left !== null && left <= 14;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6">
      <h1 className="text-xl font-semibold text-ink">Account</h1>
      <p className="mt-0.5 text-[13px] text-ink-500">Manage your profile and view your subscription.</p>

      <div className="mt-5 space-y-5">
        <section className="card" aria-labelledby="profile-heading">
          <h2 id="profile-heading" className="border-b border-ink-900/10 px-5 py-3 text-sm font-semibold">
            Profile
          </h2>
          <div className="p-5">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Skeleton className="h-12 w-12 rounded-full" />
              ) : (
                <Avatar name={data?.name} src={data?.profilePicture} size="lg" className="!bg-ink-800 !text-white" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{isLoading ? "Loading…" : data?.name}</p>
                <p className="truncate text-[13px] text-ink-500">{isLoading ? "" : data?.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
              <TextField
                label="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                error={nameError}
                maxLength={50}
                autoComplete="name"
                disabled={isLoading}
                hint="Your email is your sign-in and can't be changed here."
              />
              <Button
                type="submit"
                variant="primary"
                loading={saveLoading}
                disabled={!changed || trimmed.length < 2}
                className="sm:mt-[26px]"
              >
                Save changes
              </Button>
            </form>
          </div>
        </section>

        <section className="card" aria-labelledby="sub-heading">
          <h2 id="sub-heading" className="border-b border-ink-900/10 px-5 py-3 text-sm font-semibold">
            Subscription
          </h2>
          <dl className="divide-y divide-ink-900/10 px-5">
            <Row label="Plan">
              <span className="font-semibold">{isLoading ? "…" : data?.subscriptionPlan || "No plan"}</span>
            </Row>
            <Row label="Renews or ends">
              {data?.subscriptionEndDate ? formatDate(data.subscriptionEndDate) : "No end date on file"}
            </Row>
            <Row label="Status">
              {left === null ? (
                "—"
              ) : (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
                    ending
                      ? "bg-amber-50 text-amber-800 ring-amber-600/25"
                      : "bg-emerald-50 text-emerald-800 ring-emerald-600/25",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", ending ? "bg-amber-500" : "bg-emerald-600")} />
                  {left === 0 ? "Ends today" : `Active, ${left} day${left === 1 ? "" : "s"} left`}
                </span>
              )}
            </Row>
          </dl>
          <p className="rounded-b-xl border-t border-ink-900/10 bg-white/40 px-5 py-3 text-[13px] text-ink-600">
            To renew or change your plan, email{" "}
            <a className="font-medium text-signal-700 hover:underline" href="mailto:info@prospectintelhq.com">
              info@prospectintelhq.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
