import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../ui/cn";

/**
 * Same props as before, so every caller keeps working:
 *  pagination { currentPage, totalPages, total? }, onPageChange,
 *  itemsPerPage?, onItemsPerPageChange?, itemsPerPageOptions?
 * `compact` gives the small Prev / Next-only version used inside popovers.
 */
const Pagination = ({
  pagination = { currentPage: 1, totalPages: 1 },
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
  compact = false,
  className,
}) => {
  const { currentPage = 1, totalPages = 1 } = pagination || {};
  const total = pagination?.total ?? pagination?.totalCount;

  if (totalPages <= 0 || total === 0) return null;
  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  const stepBtn =
    "inline-flex h-8 items-center gap-1 rounded-lg border border-white/80 bg-white/65 px-2 text-[13px] font-medium text-ink-600 backdrop-blur-md transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        compact ? "mt-2" : "mt-4",
        className,
      )}
    >
      {onItemsPerPageChange ? (
        <label className="flex items-center gap-2 text-[13px] text-ink-500">
          Rows per page
          <select
            value={itemsPerPage || 10}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-white/80 bg-white/65 px-2 text-[13px] font-medium text-ink backdrop-blur-md focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <span />
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={stepBtn}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {!compact && <span>Prev</span>}
          </button>

          {!compact &&
            pages.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 rounded-lg px-2 text-[13px] font-medium tabular-nums transition-colors",
                  p === currentPage
                    ? "bg-white text-ink shadow-card"
                    : "text-ink-500 hover:bg-white/60",
                )}
              >
                {p}
              </button>
            ))}
          {compact && (
            <span className="px-1 text-[13px] tabular-nums text-ink-500">
              {currentPage} / {totalPages}
            </span>
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={stepBtn}
          >
            {!compact && <span>Next</span>}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Pagination;
