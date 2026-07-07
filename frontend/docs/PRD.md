# Frontend PRD: Employee Management Web App

## 1. Overview

### 1.1 Product Name
Employee Management Web App

### 1.2 Objective
Build a frontend web app using **Next.js** and **React** to display and update employee information.

The app must read employee data from the Laravel backend API and allow users to update employee records through a modal form.

### 1.3 Technology

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js |
| UI Library | React |
| Language | TypeScript, if selected during setup |
| Styling | Custom Next.js app styles |
| API Source | Laravel backend API |

---

## 2. Frontend Goals

The frontend should:

1. Fetch employee data from the backend API.
2. Display employee data in a reusable React table component.
3. Support server-side numbered pagination.
4. Provide search by employee name or email.
5. Provide status filtering.
6. Allow the user to choose rows per page.
7. Show an `Actions` column as the rightmost table column.
8. Show the `Update` button only for active employees.
9. Open an update modal when the `Update` button is clicked.
10. Allow editing of name, email, and active status.
11. Save updates by sending a PATCH request to the backend API.
12. Handle loading, empty, validation, and error states.
13. Keep the UI clean, simple, and easy to use.
14. Show a confirmation warning when the user submits a deactivation.
15. Show a brief success message in the modal after a successful save.

---

## 3. Non-Goals

The following features are outside the frontend scope:

1. Employee creation.
2. Employee deletion.
3. Authentication UI.
4. Role-based screens.
5. Bulk update.
6. Deep-linking filter state into the URL.
8. Export to CSV or Excel.
9. Complex dashboard charts.
10. External UI component libraries.

---

## 4. Employee Data Type

The frontend should use this employee type:

```ts
export type Employee = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};
```

Example API response expected from backend:

```json
{
  "employees": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@ayp-group.com",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@ayp-group.com",
      "isActive": false
    },
    {
      "id": 3,
      "name": "Tom Smith",
      "email": "tom@ayp-group.com",
      "isActive": true
    }
  ],
  "meta": {
    "currentPage": 1,
    "perPage": 10,
    "total": 3,
    "lastPage": 1
  }
}
```

---

## 5. API Integration

The frontend must call the Laravel API.

Required API calls:

| Action | Method | Endpoint |
|---|---|---|
| Fetch employee list | GET | `/employees?page={page}&per_page={perPage}&search={search}&status={status}` |
| Update employee | PATCH | `/employees/{id}` |

### 5.1 Environment Variable

The API base URL should come from an environment variable.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Do not hardcode the API URL directly inside React components.

---

## 6. Main Page Requirements

The main page should:

1. Load employees when the page opens.
2. Show a loading state while data is being fetched.
3. Show an error state if the employee list cannot be loaded.
4. Show an empty state if there are no employees.
5. Show the employee table when data is available.
6. Keep pagination controls visible even when there is only one page.

Recommended page flow:

```text
User opens page
→ Frontend calls GET /employees
→ Loading state appears
→ API returns employee data
→ Employee table renders
```

---

## 7. Employee Table Requirements

### 7.1 Table Component

Create a reusable React component:

```text
EmployeeTable
```

The employee table should display the list of employees.

### 7.2 Table Columns

| Column | Description |
|---|---|
| ID | Employee ID |
| Name | Employee name |
| Email | Employee email |
| Status | Employee active status |
| Actions | Action buttons |

The `Actions` column must always be the rightmost column.

### 7.3 Table Example

| ID | Name | Email | Status | Actions |
|---:|---|---|---|---|
| 1 | John Smith | john@ayp-group.com | Active | Update |
| 2 | Jane Smith | jane@ayp-group.com | Deactivated | - |
| 3 | Tom Smith | tom@ayp-group.com | Active | Update |

### 7.4 Status Display

| isActive Value | Display Text |
|---|---|
| true | Active |
| false | Deactivated |

### 7.5 Action Button Rule

The `Update` button must only appear if:

```ts
employee.isActive === true
```

If the employee is inactive, the action area should be empty or display a non-clickable placeholder such as:

```text
-
```

## 7.6 Table Pagination

The employee table should be driven by server-side pagination.

The UI should render:

1. Previous and Next controls.
2. Numbered page buttons.
3. Ellipses when the page count is large.
4. A rows-per-page selector aligned with the pagination controls.

The current page, total rows, and last page should come from the API `meta` payload.

---

## 8. Update Employee Modal Requirements

When the user clicks the `Update` button, the app should display a modal.

### 8.1 Modal Purpose

The modal allows users to update:

1. Employee name.
2. Employee email.
3. Employee active status.

### 8.2 Modal Components

| Component | Purpose |
|---|---|
| TextInput | Update employee name |
| TextInput | Update employee email |
| Switch | Update employee active status |
| Save Button | Submit updated employee data |
| Cancel Button | Close modal without saving |

### 8.3 Modal Fields

| Field | Component | Required | Default Value |
|---|---|---:|---|
| name | TextInput | Yes | Current employee name |
| email | TextInput | Yes | Current employee email |
| isActive | Switch | Yes | Current employee status |

### 8.4 Modal Open Behavior

When the user clicks `Update`:

1. Store the selected employee.
2. Open the modal.
3. Pre-fill the form with the employee’s current data.

### 8.5 Save Behavior

When the user clicks `Save`:

1. Validate the form.
2. Disable the Save button while submitting.
3. Send a PATCH request to `/employees/{id}`.
4. Show loading state during submission.
5. On success:
   - Update the employee row in the table.
   - Show a brief success message in the modal.
   - Close the modal automatically after the confirmation is shown.
6. On failure:
   - Keep the modal open.
   - Show only the backend message.
   - Re-enable the Save button.

### 8.6 Deactivation Confirmation

If the user submits an update that changes `isActive` from `true` to `false`, the frontend should show a confirmation prompt before saving.

The confirmation message should warn that the account cannot be activated back and should ask the user to confirm.

If the user cancels the confirmation, the update should not be saved.

### 8.7 Cancel Behavior

When the user clicks `Cancel`:

1. Close the modal.
2. Discard unsaved changes.
3. Do not call the API.

---

## 9. Frontend Validation Requirements

Before sending the PATCH request, the frontend should validate the form.

| Field | Rule | Error Message |
|---|---|---|
| name | Required | Name is required. |
| email | Required | Email is required. |
| email | Valid email format | Please enter a valid email address. |
| isActive | Boolean | Status must be valid. |

Frontend validation is for user experience. Backend validation is still required.

Validation and API error display should prefer the backend `message` value.

For structured 422 responses, the frontend should not render the raw `errors` object.

---

## 10. Loading States

### 10.1 Employee List Loading

While fetching employee data, show:

```text
Loading employees...
```

When paging or refreshing the current page, a lighter inline loading indicator is acceptable.

### 10.2 Update Loading

While saving employee changes:

1. Disable the Save button.
2. Show loading text or spinner.
3. Prevent duplicate submissions.

Example button text:

```text
Saving...
```

---

## 11. Error States

### 11.1 Employee List Error

If the employee list cannot be loaded, show:

```text
Unable to load employees. Please try again.
```

The UI may show the backend message directly when available.

### 11.2 Update Error

If updating an employee fails, show:

```text
Unable to update employee. Please check the form and try again.
```

The modal should remain open.

If the backend returns a message, show that message instead of a generic one.

### 11.3 Validation Error

If validation fails, show field-level errors inside the modal.

---

## 12. Empty State

If there are no employees, display:

```text
No employees found.
```

---

## 13. UI/UX Requirements

The UI should be clean, readable, and suitable for an employee management screen.

The design should prioritize:

1. Readability.
2. Clear actions.
3. Good spacing.
4. Simple form flow.
5. Clear status display.
6. Clear loading states.
7. Clear error states.

The toolbar should keep search, status, and rows-per-page controls visually grouped.

The search field should submit on blur or Enter rather than every keystroke.

The status control should use toggle-style buttons.

The table illustration from the original requirement is only a functional reference.

Do not copy the illustration exactly.

---

## 14. Performance Requirements

The employee list can contain up to 1,000 records.

The frontend should:

1. Use stable React keys, preferably `employee.id`.
2. Avoid unnecessary re-renders.
3. Avoid expensive calculations during render.
4. Keep table rendering simple.
5. Use server-side pagination instead of rendering all records at once.

No table, pagination, or virtualization libraries should be installed unless explicitly approved.

---

## 15. Suggested Frontend Structure

```text
app/
  employees/
    page.tsx

components/
  employees/
    EmployeeTable.tsx
    EmployeeUpdateModal.tsx
    EmployeeStatusBadge.tsx
    EmployeeActions.tsx
    EmployeePagination.tsx
    EmployeeSearch.tsx
    EmployeeStatusFilter.tsx

lib/
  api/
  employees.ts

types/
  employee.ts
```

### 15.1 Component Responsibilities

| Component | Responsibility |
|---|---|
| EmployeeTable | Display employee records in a table |
| EmployeeUpdateModal | Handle employee update form |
| EmployeeStatusBadge | Display active or deactivated status |
| EmployeeActions | Display row action buttons |
| EmployeePagination | Render page navigation and rows-per-page controls |
| EmployeeSearch | Handle search by name or email |
| EmployeeStatusFilter | Handle status filtering |
| employees.ts | API request functions |
| employee.ts | Employee TypeScript types |

---

## 16. Frontend Acceptance Criteria

The frontend is considered complete when:

1. The app fetches employee data from the Laravel API.
2. Employees are displayed in a table.
3. The table contains ID, Name, Email, Status, and Actions columns.
4. The Actions column is the rightmost column.
5. The Update button only appears for active employees.
6. Inactive employees do not show a clickable Update button.
7. Clicking Update opens a modal.
8. The modal contains name input, email input, active status switch, Save button, and Cancel button.
9. The modal fields are pre-filled with the selected employee’s current data.
10. Clicking Save validates the form.
11. Clicking Save sends a PATCH request to the backend.
12. Successful update reflects in the table.
13. Clicking Cancel closes the modal without saving.
14. Loading states are handled properly.
15. Error states are handled properly.
16. Empty state is handled properly.
17. Pagination is server-driven and reflects API `meta`.
18. Search, status, and page-size controls work together correctly.

---

## 17. Frontend Testing Requirements

Recommended frontend test cases:

1. Table renders employee list correctly.
2. Active employee shows Update button.
3. Inactive employee does not show Update button.
4. Clicking Update opens modal.
5. Modal shows selected employee data.
6. Name field validation works.
7. Email required validation works.
8. Invalid email validation works.
9. Save button calls update API.
10. Cancel button closes modal.
11. Update loading state is shown.
12. Fetch error state is shown.
13. Empty state is shown.
14. Pagination behavior is shown.
15. Search submits on blur or Enter.

---

## 18. Frontend Deliverables

The frontend should deliver:

1. Next.js frontend project.
2. Employee listing page.
3. Reusable employee table component.
4. Employee update modal.
5. Status display component.
6. API request functions.
7. Employee TypeScript types.
8. Loading, empty, validation, and error states.
9. Clean UI/UX suitable for the use case.
