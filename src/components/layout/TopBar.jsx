import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellOff, CheckCheck, LogOut, Settings, Star, Compass } from "lucide-react";
import { Logo } from "../../assets/export";
import { useAppDispatch, useAuth } from "../../lib/store/hook";
import { logout } from "../../lib/store/feature/authSlice";
import { resetFilters } from "../../lib/store/feature/filterSlice";
import { logActivity } from "../../lib/store/actions/activityActions";
import { getNotification, getNotificationCount, getProfile } from "../../lib/query/queryFn";
import { timeAgo } from "../../lib/helpers";
import axiosinstance from "../../axios";
import { ErrorToast, SuccessToast } from "../global/Toaster";
import Pagination from "../global/Pagination";
import Popover from "../../ui/Popover";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import { cn } from "../../ui/cn";

export const NAV_ITEMS = [
  { to: "/app/dashboard", label: "Discover", icon: Compass },
  { to: "/app/saved", label: "Saved", icon: Star },
  { to: "/app/settings", label: "Account", icon: Settings, mobileOnly: true },
];

const daysLeft = (end) => {
  if (!end) return null;
  const ms = new Date(end).getTime() - Date.now();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86400000));
};

function PlanBadge({ profile }) {
  const plan = profile?.subscriptionPlan;
  if (!plan) return null;
  const left = daysLeft(profile?.subscriptionEndDate);
  const ending = left !== null && left <= 14;
  return (
    <Link
      to="/app/settings"
      title="View subscription"
      className={cn(
        "hidden items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors sm:inline-flex",
        ending
          ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
          : "border-white/80 bg-white/60 text-ink-500 hover:bg-white",
      )}
    >
      <span className="font-semibold text-ink">{plan}</span>
      {left !== null && (
        <span>{left === 0 ? "Ends today" : `${left} day${left === 1 ? "" : "s"} left`}</span>
      )}
    </Link>
  );
}

function NotificationsMenu() {
  const [page, setPage] = useState(1);
  const [readLoading, setReadLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notification", page],
    queryFn: () => getNotification({ page }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
  const { data: count, refetch: refetchCount } = useQuery({
    queryKey: ["notificationCount", page],
    queryFn: () => getNotificationCount({ page }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const unread = Number(count?.count) || 0;
  const items = data?.data || [];

  const handleReadAll = async (close) => {
    setReadLoading(true);
    try {
      const response = await axiosinstance.patch("/notification/read");
      if (response?.status === 200) {
        SuccessToast(response?.data?.message);
        refetch();
        refetchCount();
        close();
      }
    } catch (err) {
      ErrorToast(err?.response?.data?.message);
    } finally {
      setReadLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data?.pagination?.totalPages) setPage(newPage);
  };

  return (
    <Popover
      align="end"
      glass="menu"
      label="Notifications"
      inset
      panelClassName="sm:w-96"
      trigger={({ triggerProps }) => (
        <button
          {...triggerProps}
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>
      )}
    >
      {({ close }) => (
        <div className="text-ink">
          <div className="flex items-center justify-between border-b border-ink-900/10 px-4 py-2.5">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Button
              size="sm"
              variant="ghost"
              loading={readLoading}
              disabled={items.length === 0}
              onClick={() => handleReadAll(close)}
            >
              {!readLoading && <CheckCheck className="h-4 w-4" />}
              Mark all read
            </Button>
          </div>

          <div className="max-h-[min(420px,60vh)] overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex animate-pulse gap-3 border-b border-line px-4 py-3.5 last:border-0">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-ink-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/2 rounded bg-ink-100" />
                    <div className="h-3 w-4/5 rounded bg-ink-100" />
                  </div>
                </div>
              ))
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-10 text-center">
                <BellOff className="mb-3 h-8 w-8 text-ink-300" />
                <p className="text-sm font-medium text-ink">You&apos;re all caught up</p>
                <p className="mt-1 text-[13px] text-ink-400">New announcements from Prospect Intel will show up here.</p>
              </div>
            ) : (
              items.map((item, i) => (
                <article key={item?._id || i} className="flex gap-3 border-b border-ink-900/[0.07] px-4 py-3.5 last:border-0">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-500">
                    <Bell className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="truncate text-[13px] font-semibold">{item?.title}</h4>
                      <time className="shrink-0 text-xs text-ink-400">{timeAgo(item?.createdAt) || "now"}</time>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{item?.description}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          {(data?.pagination?.totalPages || 1) > 1 && (
            <div className="border-t border-ink-900/10 px-3 pb-3">
              <Pagination compact pagination={data?.pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}
    </Popover>
  );
}

function AccountMenu({ profile }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const name = profile?.name || user?.name || "Account";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await dispatch(
        logActivity({
          title: "User Logged Out",
          description: "User Logged Out",
          metaData: { type: "Logged Out" },
        }),
      );
      dispatch(logout());
      dispatch(resetFilters());
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("Logout Activity Error:", error);
      setLoggingOut(false);
    }
  };

  const item =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium text-ink-700 transition-colors hover:bg-white/60 hover:text-ink";

  return (
    <>
      <Popover
        align="end"
        glass="menu"
        label="Account menu"
        panelClassName="w-64"
        trigger={({ triggerProps }) => (
          <button
            {...triggerProps}
            aria-label="Account menu"
            className="flex h-9 items-center gap-2 rounded-lg pl-1 pr-1 transition-colors hover:bg-white/60 sm:pr-2"
          >
            <Avatar name={name} src={profile?.profilePicture} size="sm" className="!bg-ink-800 !text-white" />
            <span className="hidden max-w-[120px] truncate text-[13px] font-medium text-ink lg:block">{name}</span>
          </button>
        )}
      >
        {({ close }) => (
          <div className="p-2 text-ink">
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar name={name} src={profile?.profilePicture} size="md" className="!bg-ink-800 !text-white" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{name}</p>
                {profile?.email && <p className="truncate text-xs text-ink-500">{profile.email}</p>}
              </div>
            </div>
            <div className="my-1 border-t border-ink-900/10" />
            <Link to="/app/settings" onClick={close} className={item}>
              <Settings className="h-4 w-4 text-ink-500" /> My account
            </Link>
            <Link to="/app/saved" onClick={close} className={item}>
              <Star className="h-4 w-4 text-ink-500" /> Saved athletes
            </Link>
            <div className="my-1 border-t border-ink-900/10" />
            <button
              type="button"
              onClick={() => {
                close();
                setConfirmOpen(true);
              }}
              className={cn(item, "hover:!bg-red-500/10 hover:!text-red-700")}
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        )}
      </Popover>

      <Dialog
        open={confirmOpen}
        onClose={() => !loggingOut && setConfirmOpen(false)}
        size="sm"
        title="Log out of Prospect Intel?"
        description="You will need to sign in again to search and review athletes."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={loggingOut}>
              Stay signed in
            </Button>
            <Button variant="danger" onClick={handleLogout} loading={loggingOut} data-autofocus>
              Log out
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3">
          <Avatar name={name} src={profile?.profilePicture} size="md" className="!bg-ink-800 !text-white" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            {profile?.email && <p className="truncate text-xs text-ink-500">{profile.email}</p>}
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default function TopBar() {
  const { data: profile } = useQuery({
    queryKey: ["profileMe"],
    queryFn: getProfile,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/70 bg-white/60 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <Link to="/app/dashboard" className="flex items-center gap-2 rounded-md pr-2" aria-label="Prospect Intel home">
          <img src={Logo} alt="" className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight text-ink">Prospect Intel</span>
        </Link>

        <nav aria-label="Primary" className="ml-6 hidden h-full items-stretch gap-1 md:flex">
          {NAV_ITEMS.filter((n) => !n.mobileOnly).map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "relative flex items-center px-3 text-[13px] font-medium transition-colors",
                  isActive ? "text-ink" : "text-ink-500 hover:text-ink",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-t bg-signal" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <PlanBadge profile={profile} />
          <NotificationsMenu />
          <AccountMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
