import type { Employee } from "@/types/employee";
import { EmployeeActions } from "./EmployeeActions";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import styles from "./EmployeeTable.module.css";

export function EmployeeTable({
  employees,
  onUpdate,
}: {
  employees: Employee[];
  onUpdate: (employee: Employee) => void;
}) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.mobileList}>
        {employees.map((employee) => (
          <article key={employee.id} className={styles.mobileCard}>
            <div className={styles.mobileTopRow}>
              <div>
                <p className={styles.mobileLabel}>Employee #{employee.id}</p>
                <h3 className={styles.mobileName}>{employee.name}</h3>
              </div>
              <EmployeeStatusBadge isActive={employee.isActive} />
            </div>
            <dl className={styles.mobileDetails}>
              <div>
                <dt>Email</dt>
                <dd>{employee.email}</dd>
              </div>
            </dl>
            <div className={styles.mobileActions}>
              <EmployeeActions employee={employee} onUpdate={onUpdate} />
            </div>
          </article>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th className={styles.actionsHead}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>
                <EmployeeStatusBadge isActive={employee.isActive} />
              </td>
              <td className={styles.actionsCell}>
                <EmployeeActions employee={employee} onUpdate={onUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
