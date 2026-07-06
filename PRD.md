# PRD: Employee Management Web App

## 1. Overview

### 1.1 Product Name
Employee Management Web App

### 1.2 Objective
Build a simple employee management web application using **Laravel** for the backend API and **Next.js / React** for the frontend.

The app allows users to view a list of employees and update employee details through a modal form. Employee data should be fetched from the backend API, displayed in a table, and updated through a PATCH API request.

### 1.3 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | PHP Laravel |
| API Style | REST API |
| Data Format | JSON |
| Styling | Any suitable UI approach, for example Tailwind CSS, CSS Modules, or component library |
| Database | MySQL / SQLite / PostgreSQL, depending on project setup |

---

## 2. Goals

The main goals of this project are:

1. Create a Laravel API to manage employee data.
2. Provide an endpoint to retrieve the employee list.
3. Provide an endpoint to update employee information by employee ID.
4. Build a Next.js frontend that consumes the Laravel API.
5. Display employee data in a reusable React `<Table>` component.
6. Support up to 1,000 employee records in the table.
7. Allow updating employee details through a modal.
8. Show the `Update` action only for active employees.

---

## 3. Non-Goals

The following features are outside the current scope:

1. Employee creation.
2. Employee deletion.
3. Authentication and authorization.
4. Role-based access control.
5. Bulk update.
6. Advanced reporting.
7. Audit logs.
8. Export to CSV or Excel.
9. Server-side pagination, unless needed for performance improvement.

---

## 4. User Stories

### 4.1 View Employee List

As a user, I want to view a list of employees so that I can see employee details such as ID, name, email, and status.

### 4.2 Update Active Employee

As a user, I want to update an active employee’s details so that employee information can be corrected or changed.

### 4.3 Hide Update Action for Inactive Employee

As a user, I should only see the `Update` button for active employees so that inactive employees cannot be edited directly from the table.

### 4.4 Cancel Update

As a user, I want to cancel the update process so that I can close the modal without saving changes.

---

## 5. Data Model

### 5.1 Employee Entity

| Field | Type | Required | Description |
|---|---:|---:|---|
| id | number | Yes | Unique employee ID |
| name | string | Yes | Employee full name |
| email | string | Yes | Employee email address |
| isActive | boolean | Yes | Employee active status |

### 5.2 Example Response

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
  ]
}
```

---

## 6. Backend Requirements

### 6.1 Backend Framework

The backend must be developed using **PHP Laravel**.

### 6.2 API Requirements

The backend API should expose REST endpoints for reading and updating employee data.

### 6.3 Minimum API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Returns the employee list |
| PATCH | `/employees/{id}` | Updates employee details by ID |

---

## 7. Backend API Specification

## 7.1 GET `/employees`

### Description
Returns a list of employees.

### Request
No request body is required.

### Success Response

**Status Code:** `200 OK`

```json
{
  "employees": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@ayp-group.com",
      "isActive": true
    }
  ]
}
```

### Error Response

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Unable to retrieve employees."
}
```

---

## 7.2 PATCH `/employees/{id}`

### Description
Updates employee details by employee ID.

### URL Parameter

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| id | number | Yes | Employee ID |

### Request Body

```json
{
  "name": "John Smith",
  "email": "john@ayp-group.com",
  "isActive": true
}
```

### Validation Rules

| Field | Rule |
|---|---|
| name | Required, string, maximum 255 characters |
| email | Required, valid email format, maximum 255 characters |
| isActive | Required, boolean |

### Success Response

**Status Code:** `200 OK`

```json
{
  "employee": {
    "id": 1,
    "name": "John Smith",
    "email": "john@ayp-group.com",
    "isActive": true
  },
  "message": "Employee updated successfully."
}
```

### Error Responses

#### Employee Not Found

**Status Code:** `404 Not Found`

```json
{
  "message": "Employee not found."
}
```

#### Validation Error

**Status Code:** `422 Unprocessable Entity`

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field must be a valid email address."
    ]
  }
}
```

#### Server Error

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Unable to update employee."
}
```

---

## 8. Frontend Requirements

### 8.1 Frontend Framework

The frontend must be developed using **Next.js** and **React**.

### 8.2 Main Features

The frontend must:

1. Fetch the employee list from the Laravel API.
2. Display employee data in a React `<Table>` component.
3. Display up to 1,000 employee records.
4. Show an `Actions` column as the rightmost column.
5. Show an `Update` button only when the employee is active.
6. Open a modal when the `Update` button is clicked.
7. Allow editing of:
   - Employee name
   - Employee email
   - Employee active status
8. Save updates by calling the PATCH API.
9. Close the modal after a successful update.
10. Refresh or update the table data after saving.
11. Allow users to cancel and close the modal without saving.

---

## 9. Frontend UI Requirements

## 9.1 Employee Table

### Table Columns

| Column | Description |
|---|---|
| ID | Employee ID |
| Name | Employee name |
| Email | Employee email |
| Status | Employee active status |
| Actions | Action buttons |

### Table Example

| ID | Name | Email | Status | Actions |
|---:|---|---|---|---|
| 1 | John Smith | john@ayp-group.com | Active | Update |
| 2 | Jane Smith | jane@ayp-group.com | Deactivated | - |
| 3 | Tom Smith | tom@ayp-group.com | Active | Update |

### Status Display

| isActive Value | Display Text |
|---|---|
| true | Active |
| false | Deactivated |

### Action Button Rule

The `Update` button must only appear if:

```ts
employee.isActive === true
```

If the employee is inactive, the action area should be empty or display a non-clickable placeholder such as `-`.

---

## 9.2 Update Employee Modal

When the `Update` button is clicked, display a modal containing the selected employee’s current information.

### Modal Components

| Component | Purpose |
|---|---|
| TextInput | Update employee name |
| TextInput | Update employee email |
| Switch | Update employee active status |
| Save Button | Submit updated employee data |
| Cancel Button | Close modal without saving |

### Modal Fields

| Field | Component | Required | Default Value |
|---|---|---:|---|
| name | TextInput | Yes | Current employee name |
| email | TextInput | Yes | Current employee email |
| isActive | Switch | Yes | Current employee status |

### Save Behavior

When the user clicks `Save`:

1. Validate the form.
2. Disable the save button while submitting.
3. Send PATCH request to `/employees/{id}`.
4. Show loading state during submission.
5. On success:
   - Update the employee row in the table.
   - Close the modal.
   - Optionally show a success message.
6. On failure:
   - Keep the modal open.
   - Show error message.
   - Re-enable the save button.

### Cancel Behavior

When the user clicks `Cancel`:

1. Close the modal.
2. Discard unsaved changes.
3. Do not call the API.

---

## 10. UI/UX Guidelines

### 10.1 Table UX

The table should be clean, readable, and suitable for viewing up to 1,000 records.

Recommended UX considerations:

1. Use proper spacing and alignment.
2. Keep ID column narrow.
3. Keep email column readable.
4. Use clear visual status indicators.
5. Keep the `Actions` column fixed as the rightmost column.
6. Avoid unnecessary visual clutter.

### 10.2 Performance Considerations

Since the employee list can contain up to 1,000 records:

1. Avoid unnecessary re-renders.
2. Use stable React keys, preferably `employee.id`.
3. Consider pagination, virtual scrolling, or search if performance becomes an issue.
4. Keep table component reusable and simple.
5. Avoid heavy client-side computation during render.

### 10.3 Modal UX

The modal should:

1. Clearly show that the user is editing an employee.
2. Display the selected employee’s current values.
3. Prevent accidental double submission.
4. Provide clear validation messages.
5. Allow easy cancellation.
6. Be responsive on smaller screens.

---

## 11. Validation Requirements

### 11.1 Frontend Validation

Before sending the PATCH request:

| Field | Rule | Error Message |
|---|---|---|
| name | Required | Name is required. |
| email | Required | Email is required. |
| email | Valid email format | Please enter a valid email address. |
| isActive | Boolean | Status must be valid. |

### 11.2 Backend Validation

The Laravel API must also validate all incoming PATCH requests.

Frontend validation is for user experience only. Backend validation is required for data integrity.

---

## 12. Error Handling

### 12.1 API Fetch Error

If the frontend fails to fetch employees:

1. Display an error message.
2. Allow the user to retry.
3. Avoid showing an empty table without explanation.

Example message:

```text
Unable to load employees. Please try again.
```

### 12.2 Update Error

If updating an employee fails:

1. Keep the modal open.
2. Display the error message.
3. Allow the user to retry.

Example message:

```text
Unable to update employee. Please check the form and try again.
```

### 12.3 Validation Error

If the API returns validation errors, display the relevant field-level errors inside the modal.

---

## 13. Loading States

### 13.1 Employee List Loading

While fetching employee data:

1. Show a loading indicator.
2. Do not show stale or incomplete data unless intentionally cached.

Example:

```text
Loading employees...
```

### 13.2 Update Loading

While saving employee changes:

1. Disable the `Save` button.
2. Show loading text or spinner.
3. Prevent duplicate submissions.

Example button text:

```text
Saving...
```

---

## 14. Suggested Frontend Component Structure

```text
components/
  employees/
    EmployeeTable.tsx
    EmployeeUpdateModal.tsx
    EmployeeStatusBadge.tsx
    EmployeeActions.tsx

lib/
  api/
    employees.ts

types/
  employee.ts
```

### 14.1 Component Responsibilities

| Component | Responsibility |
|---|---|
| EmployeeTable | Display employee records in a table |
| EmployeeUpdateModal | Handle employee update form |
| EmployeeStatusBadge | Display active or deactivated status |
| EmployeeActions | Display row action buttons |
| employees.ts | API request functions |
| employee.ts | Employee TypeScript types |

---

## 15. Suggested Backend Structure

```text
app/
  Http/
    Controllers/
      EmployeeController.php
    Requests/
      UpdateEmployeeRequest.php

app/
  Models/
    Employee.php

database/
  migrations/
    create_employees_table.php

routes/
  api.php
```

### 15.1 Backend Responsibilities

| File | Responsibility |
|---|---|
| EmployeeController.php | Handle employee API logic |
| UpdateEmployeeRequest.php | Validate employee update request |
| Employee.php | Employee model |
| create_employees_table.php | Employee database schema |
| api.php | API route definitions |

---

## 16. Database Schema

### 16.1 Employees Table

| Column | Type | Description |
|---|---|---|
| id | unsigned big integer | Primary key |
| name | varchar(255) | Employee name |
| email | varchar(255) | Employee email |
| is_active | boolean | Employee active status |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

### 16.2 Notes

The API response should expose `isActive` in camelCase, even if the database column is stored as `is_active`.

---

## 17. API Data Mapping

### 17.1 Backend Database to API Response

| Database Column | API Field |
|---|---|
| id | id |
| name | name |
| email | email |
| is_active | isActive |

### 17.2 Frontend TypeScript Type

```ts
export type Employee = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};
```

---

## 18. Acceptance Criteria

### 18.1 Backend Acceptance Criteria

The backend is considered complete when:

1. `GET /employees` returns a JSON list of employees.
2. `PATCH /employees/{id}` updates an employee by ID.
3. PATCH request validates `name`, `email`, and `isActive`.
4. Invalid employee ID returns `404`.
5. Invalid request body returns `422`.
6. Successful update returns the updated employee data.
7. API response uses the expected JSON format.

### 18.2 Frontend Acceptance Criteria

The frontend is considered complete when:

1. The app fetches employee data from the Laravel API.
2. Employees are displayed in a table.
3. The table contains ID, Name, Email, Status, and Actions columns.
4. The Actions column is the rightmost column.
5. The Update button only appears for active employees.
6. Clicking Update opens a modal.
7. The modal contains name input, email input, active status switch, Save button, and Cancel button.
8. Clicking Save sends a PATCH request to the backend.
9. Successful update reflects in the table.
10. Clicking Cancel closes the modal without saving.
11. Loading and error states are handled properly.
12. The table can handle up to 1,000 employee records.

---

## 19. Edge Cases

| Case | Expected Behavior |
|---|---|
| Employee list is empty | Show empty state message |
| API request fails | Show error message and retry option |
| PATCH API fails | Keep modal open and show error |
| Employee is inactive | Hide Update button |
| Invalid email | Show validation error |
| User clicks Save multiple times | Prevent duplicate request |
| Employee not found | Show proper error message |
| Large employee list | Table remains usable |

---

## 20. Empty State

If there are no employees, display:

```text
No employees found.
```

---

## 21. Security Considerations

Although authentication is outside the current scope, the following should still be considered:

1. Validate all backend input.
2. Sanitize API responses where necessary.
3. Avoid exposing stack traces in production.
4. Configure CORS properly between Next.js and Laravel.
5. Use environment variables for API base URLs.
6. Avoid hardcoding sensitive configuration.

---

## 22. Environment Configuration

### 22.1 Frontend Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 22.2 Backend Environment Variables

Laravel `.env` should contain the proper database configuration.

Example:

```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=employee_app
DB_USERNAME=root
DB_PASSWORD=
```

---

## 23. Recommended API Flow

### 23.1 Load Employees

```text
User opens page
→ Next.js calls GET /employees
→ Laravel returns employee list
→ Frontend renders table
```

### 23.2 Update Employee

```text
User clicks Update
→ Modal opens with selected employee data
→ User edits fields
→ User clicks Save
→ Frontend calls PATCH /employees/{id}
→ Laravel validates request
→ Laravel updates employee
→ Laravel returns updated employee
→ Frontend updates table
→ Modal closes
```

---

## 24. Testing Requirements

### 24.1 Backend Tests

Recommended test cases:

1. Can retrieve employee list.
2. Can update employee name.
3. Can update employee email.
4. Can update employee active status.
5. Cannot update employee with invalid email.
6. Cannot update non-existing employee.
7. PATCH endpoint returns validation errors when required fields are missing.

### 24.2 Frontend Tests

Recommended test cases:

1. Table renders employee list correctly.
2. Active employee shows Update button.
3. Inactive employee does not show Update button.
4. Clicking Update opens modal.
5. Modal shows selected employee data.
6. Save button calls update API.
7. Cancel button closes modal.
8. Validation errors are displayed properly.

---

## 25. Future Improvements

Possible future enhancements:

1. Add employee creation.
2. Add employee deletion.
3. Add search and filtering.
4. Add pagination.
5. Add sorting.
6. Add authentication.
7. Add role-based permissions.
8. Add audit logs for employee updates.
9. Add toast notifications.
10. Add optimistic UI updates.
11. Add server-side pagination for larger datasets.

---

## 26. Final Deliverables

The project should deliver:

1. Laravel backend API.
2. Employee database table and model.
3. API endpoints:
   - `GET /employees`
   - `PATCH /employees/{id}`
4. Next.js frontend app.
5. Reusable React table component.
6. Update employee modal.
7. Proper loading, validation, and error handling.
8. Clean UI/UX suitable for the use case.
