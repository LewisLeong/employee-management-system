"use client";

import { FormEvent, useState } from "react";
import type { Employee, EmployeeFormState } from "@/types/employee";
import styles from "./EmployeeUpdateModal.module.css";

export function EmployeeUpdateModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Employee;
  onClose: () => void;
  onSave: (payload: EmployeeFormState) => Promise<void>;
}) {
  const [form, setForm] = useState<EmployeeFormState>(() => ({
    name: employee.name,
    email: employee.email,
    isActive: employee.isActive,
  }));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave(form);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Update failed.");
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} role="presentation" onClick={onClose}>
      <div aria-modal="true" className={styles.modal} role="dialog" onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h1>User Profile</h1>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <div className={styles.switchRow}>
            <span className={styles.switchLabel}>Status</span>
            <div className={styles.switchGroup}>
              <label className={styles.switch} aria-label="Toggle employee status">
                <input
                  checked={form.isActive}
                  type="checkbox"
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                />
                <span className={styles.switchTrack} aria-hidden="true">
                  <span className={styles.switchThumb} />
                </span>
              </label>
              <span className={styles.switchState}>{form.isActive ? "Active" : "Deactivated"}</span>
            </div>
          </div>
          {error ? <p className={styles.errorText}>{error}</p> : null}
          <div className={styles.modalActions}>
            <button className={styles.secondaryButton} type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button className={styles.primaryButton} type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
