import styles from "./EmployeeSearch.module.css";

type EmployeeSearchProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
  onCommit: () => void;
};

export function EmployeeSearch({ value, isLoading, onChange, onCommit }: EmployeeSearchProps) {

  return (
    <div className={styles.searchBar}>
      <label className={styles.label} htmlFor="employee-search">
        Search name or email
      </label>
      <div className={styles.inputWrap}>
        <span className={styles.icon} aria-hidden="true">
          ⌕
        </span>
        <input
          id="employee-search"
          className={styles.input}
          type="search"
          placeholder="Search by name or email"
          value={value}
          disabled={isLoading}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onCommit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onCommit();
            }
          }}
        />
      </div>
    </div>
  );
}
