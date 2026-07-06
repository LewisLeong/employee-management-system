export type Employee = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};

export type EmployeeMeta = {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
};

export type EmployeeFormState = {
  name: string;
  email: string;
  isActive: boolean;
};

export type EmployeeListResponse = {
  employees: Employee[];
  meta: EmployeeMeta;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string | null;
};
