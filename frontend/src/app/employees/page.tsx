"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EmployeePagination } from "@/components/employees/EmployeePagination";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { EmployeeStatusFilter } from "@/components/employees/EmployeeStatusFilter";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { EmployeeUpdateModal } from "@/components/employees/EmployeeUpdateModal";
import type { Employee, EmployeeFormState, EmployeeMeta } from "@/types/employee";
import { fetchEmployees, type EmployeeStatusFilter as EmployeeStatusFilterValue, updateEmployee } from "./actions";
import styles from "./page.module.css";

export default function EmployeesPage() {
  const pageSizeOptions = [5, 10, 20, 50];
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<EmployeeMeta | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<EmployeeStatusFilterValue>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedOnce = useRef(false);
  const selectedEmployeeRef = useRef<Employee | null>(null);

  useEffect(() => {
    selectedEmployeeRef.current = selectedEmployee;
  }, [selectedEmployee]);

  useEffect(() => {
    let alive = true;

    async function loadEmployees() {
      try {
        if (!hasLoadedOnce.current) {
          setIsInitialLoading(true);
        } else {
          setIsLoadingPage(true);
        }
        setError(null);
        const data = await fetchEmployees(currentPage, pageSize, search, status);
        if (alive) {
          setEmployees(data.employees ?? []);
          setMeta(data.meta ?? null);
          const activeSelection = selectedEmployeeRef.current;
          if (activeSelection && !(data.employees ?? []).some((employee) => employee.id === activeSelection.id)) {
            setSelectedEmployee(null);
          }
          hasLoadedOnce.current = true;
        }
      } catch (loadError) {
        if (alive) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load employees.");
        }
      } finally {
        if (alive) {
          setIsInitialLoading(false);
          setIsLoadingPage(false);
        }
      }
    }

    loadEmployees();

    return () => {
      alive = false;
    };
  }, [currentPage, pageSize, search, status]);

  const summary = useMemo(() => {
    const active = employees.filter((employee) => employee.isActive).length;
    return { total: meta?.total ?? employees.length, active };
  }, [employees, meta]);

  const lastPage = meta?.lastPage ?? 1;

  function handlePageChange(page: number) {
    if (page === currentPage || page < 1 || (lastPage > 0 && page > lastPage)) return;
    setCurrentPage(page);
  }

  function handlePageSizeChange(nextPageSize: number) {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }

  function handleSearchChange(nextSearch: string) {
    setSearchInput(nextSearch);
  }

  function handleSearchClear() {
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
  }

  function commitSearch() {
    if (searchInput === search) return;
    setSearch(searchInput);
    setCurrentPage(1);
  }

  function handleStatusChange(nextStatus: EmployeeStatusFilterValue) {
    setStatus(nextStatus);
    setCurrentPage(1);
  }

  async function handleSave(payload: EmployeeFormState) {
    if (!selectedEmployee) return;
    const updated = await updateEmployee(selectedEmployee.id, payload);
    setEmployees((current) =>
      current.map((employee) => (employee.id === updated.id ? updated : employee)),
    );
    setSelectedEmployee(null);
    const refreshed = await fetchEmployees(currentPage, pageSize, search, status);
    setEmployees(refreshed.employees ?? []);
    setMeta(refreshed.meta ?? null);
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.hero}>
          <div>
            <p className={styles.kicker}>Employee management</p>
            <h1>Review and update active employees.</h1>
          </div>
          <div className={styles.stats}>
            <div>
              <span>Total</span>
              <strong>{summary.total}</strong>
            </div>
            <div>
              <span>Active</span>
              <strong>{summary.active}</strong>
            </div>
          </div>
        </div>

        <section className={styles.card}>
          <div className={styles.filtersRow}>
            <EmployeeSearch
              value={searchInput}
              isLoading={isInitialLoading || isLoadingPage}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              onCommit={commitSearch}
            />
            <EmployeeStatusFilter value={status} isLoading={isInitialLoading || isLoadingPage} onChange={handleStatusChange} />
          </div>
          {isInitialLoading ? <p className={styles.state}>Loading employees...</p> : null}
          {!isInitialLoading && error ? <p className={styles.stateError}>{error}</p> : null}
          {!isInitialLoading && !error && employees.length === 0 ? (
            <p className={styles.state}>No employees found.</p>
          ) : null}
          {!isInitialLoading && !error && employees.length > 0 ? (
            <>
              {isLoadingPage ? <p className={styles.loadingPage}>Loading page {currentPage}...</p> : null}
              <EmployeeTable employees={employees} onUpdate={setSelectedEmployee} />
              <EmployeePagination
                currentPage={meta?.currentPage ?? currentPage}
                lastPage={lastPage}
                isLoading={isLoadingPage}
                pageSize={pageSize}
                pageSizeOptions={pageSizeOptions}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          ) : null}
        </section>
      </section>

      {selectedEmployee ? (
        <EmployeeUpdateModal
          key={selectedEmployee.id}
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onSave={handleSave}
        />
      ) : null}
    </main>
  );
}
