const Pagination = ({
  pagination = { currentPage: 1, totalPages: 1 },
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50, 100],
}) => {
  const { currentPage = 1, totalPages = 1 } = pagination || {};

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 0 || pagination?.total === 0 || pagination?.totalCount === 0) return null;
  if (totalPages <= 1 && !onItemsPerPageChange) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 flex-wrap w-full">
      {/* Items per page selector */}
      {onItemsPerPageChange ? (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
          <span>Items per page:</span>
          <select
            value={itemsPerPage || 10}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-md px-2.5 py-1 text-xs sm:text-sm font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))} 
          </select>
        </div>
      ) : (
        <div />
      )}

      {/* Pagination buttons */}
      {totalPages > 1 ? (
        <div className="flex justify-end items-center gap-2 flex-wrap">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Pagination;