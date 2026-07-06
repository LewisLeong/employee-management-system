import type { Employee } from "@/types/employee";
import styles from "./EmployeeTable.module.css";

export function EmployeeActions({
  employee,
  onUpdate,
}: {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
}) {
  if (!employee.isActive) {
    return <span className={styles.placeholder}>-</span>;
  }

  return (
    <button className={styles.updateButton} type="button" onClick={() => onUpdate(employee)}>
      Update
    </button>
  );
}
