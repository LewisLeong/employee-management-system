import styles from "./EmployeePagination.module.css";

type EmployeePaginationProps = {
  currentPage: number;
  lastPage: number;
  isLoading: boolean;
  pageSize: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

function buildPages(currentPage: number, lastPage: number) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  if (start > 2) pages.push("ellipsis");

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < lastPage - 1) pages.push("ellipsis");

  pages.push(lastPage);
  return pages;
}

export function EmployeePagination({
  currentPage,
  lastPage,
  isLoading,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: EmployeePaginationProps) {
  const pages = buildPages(currentPage, lastPage);

  return (
    <nav aria-label="Employee pages" className={styles.pagination}>
      <div className={styles.pageSizeWrap}>
        <label className={styles.pageSizeLabel} htmlFor="employee-page-size">
          Rows per page
        </label>
        <select
          id="employee-page-size"
          className={styles.pageSizeSelect}
          value={pageSize}
          disabled={isLoading}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.pageControls}>
        <button
          className={styles.navButton}
          type="button"
          disabled={isLoading || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>

        <div className={styles.pageList}>
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={page}
                className={`${styles.pageButton} ${page === currentPage ? styles.active : ""}`}
                type="button"
                disabled={isLoading}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          className={styles.navButton}
          type="button"
          disabled={isLoading || currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
