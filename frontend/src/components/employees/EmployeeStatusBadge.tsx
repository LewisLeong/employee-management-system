import styles from "./EmployeeTable.module.css";

export function EmployeeStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={isActive ? styles.activePill : styles.inactivePill}>
      {isActive ? "Active" : "Deactivated"}
    </span>
  );
}
