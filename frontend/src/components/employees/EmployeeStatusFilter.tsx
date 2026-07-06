import type { EmployeeStatusFilter } from "@/app/employees/actions";
import styles from "./EmployeeStatusFilter.module.css";

type EmployeeStatusFilterProps = {
  value: EmployeeStatusFilter;
  isLoading: boolean;
  onChange: (value: EmployeeStatusFilter) => void;
};

const options: Array<{ label: string; value: EmployeeStatusFilter }> = [
  { label: "All", value: null },
  { label: "Active", value: "1" },
  { label: "Inactive", value: "0" },
];

export function EmployeeStatusFilter({ value, isLoading, onChange }: EmployeeStatusFilterProps) {
  return (
    <div className={styles.filterBar} role="group" aria-label="Filter employees by status">
      <span className={styles.label}>Status</span>
      <div className={styles.pills}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.pill} ${value === option.value ? styles.active : ""}`}
            type="button"
            disabled={isLoading}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
