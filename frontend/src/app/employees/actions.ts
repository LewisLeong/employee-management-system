import { api } from "@/lib/api/api";
import type { ApiResponse, Employee, EmployeeFormState, EmployeeListResponse } from "@/types/employee";

export type EmployeeStatusFilter = null | "1" | "0";

function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || "Request failed.");
  }

  return response.data;
}

export async function fetchEmployees(
  page = 1,
  perPage?: number,
  search?: string,
  status?: EmployeeStatusFilter,
): Promise<EmployeeListResponse> {
  const params = new URLSearchParams({ page: String(page) });

  if (perPage) {
    params.set("per_page", String(perPage));
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  const response = await api.get<ApiResponse<EmployeeListResponse>>(`/employees?${params.toString()}`);
  return unwrapResponse(response);
}

export async function updateEmployee(id: number, payload: EmployeeFormState): Promise<Employee> {
  const response = await api.patch<ApiResponse<Employee>>(`/employees/${id}`, {
    body: payload,
  });
  return unwrapResponse(response);
}
