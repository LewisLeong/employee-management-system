# Backend PRD: Employee Management API

## 1. Overview

### 1.1 Product Name
Employee Management API

### 1.2 Objective
Build a backend API using **PHP Laravel** to manage employee data for the Employee Management Web App.

The API must allow the frontend app to:

1. Retrieve a list of employees.
2. Update employee details by employee ID.

### 1.3 Technology

| Layer | Technology |
|---|---|
| Backend Framework | PHP Laravel |
| API Style | REST API |
| Response Format | JSON |
| Database | MySQL / SQLite / PostgreSQL, depending on setup |

---

## 2. Backend Goals

The backend should:

1. Provide a REST API for employee data.
2. Return employee records in a consistent JSON format.
3. Allow updating employee details by ID.
4. Validate all update requests.
5. Return proper HTTP status codes.
6. Keep code clean and maintainable using Laravel conventions.
7. Follow an OOP-friendly structure using Controller, Form Request, Service, and Model.
8. Use a shared `ApiResponse` DTO for JSON responses.

---

## 3. Non-Goals

The following features are outside the backend scope:

1. Employee creation.
2. Employee deletion.
3. Authentication.
4. Authorization.
5. Role-based access control.
6. Bulk update.
7. Audit logs.
8. File upload.
9. Export features.
10. Advanced reporting.

---

## 4. Employee Data Model

### 4.1 Employee Entity

| Field | Type | Required | Description |
|---|---:|---:|---|
| id | number | Yes | Unique employee ID |
| name | string | Yes | Employee full name |
| email | string | Yes | Employee email address |
| isActive | boolean | Yes | Employee active status |

### 4.2 Example Data

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

## 5. Database Schema

### 5.1 Employees Table

| Column | Type | Description |
|---|---|---|
| id | unsigned big integer | Primary key |
| name | varchar(255) | Employee name |
| email | varchar(255) | Employee email |
| is_active | boolean | Employee active status |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

### 5.2 Data Mapping

The database may use snake_case, but the API response must use camelCase.

| Database Column | API Field |
|---|---|
| id | id |
| name | name |
| email | email |
| is_active | isActive |

---

## 6. API Endpoints

The backend must provide the following minimum API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Returns the employee list |
| PATCH | `/employees/{id}` | Updates employee details by ID |

---

## 7. GET `/employees`

### 7.1 Description
Returns a paginated employee list.

### 7.2 Request
The endpoint accepts optional query parameters:

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| status | 1 \| 0 | No | Filters employees by active status. Omit for all employees. |
| per_page | number | No | Number of records per page. Defaults to `15`. |
| page | number | No | Page number to return. Defaults to `1`. |
| search | string | No | Searches employee name and email. |

Example:

```text
/employees?status=1&per_page=10&page=2&search=john
```

### 7.3 Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "name": "John Smith",
        "email": "john@ayp-group.com",
        "isActive": true
      }
    ],
    "meta": {
      "currentPage": 1,
      "perPage": 15,
      "total": 1,
      "lastPage": 1
    }
  },
  "message": null
}
```

### 7.4 Error Response

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "data": null,
  "message": "Unable to retrieve employees."
}
```

---

## 8. PATCH `/employees/{id}`

### 8.1 Description
Updates employee details by employee ID.

### 8.2 URL Parameter

| Parameter | Type | Required | Description |
|---|---:|---:|---|
| id | number | Yes | Employee ID |

### 8.3 Request Body

```json
{
  "name": "John Smith",
  "email": "john@ayp-group.com",
  "isActive": true
}
```

### 8.4 Validation Rules

| Field | Rule |
|---|---|
| name | Required, string, maximum 255 characters |
| email | Required, valid email format, maximum 255 characters |
| isActive | Required, boolean |

### 8.5 Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "employee": {
      "id": 1,
      "name": "John Smith",
      "email": "john@ayp-group.com",
      "isActive": true
    }
  },
  "message": null
}
```

### 8.6 Error Responses

#### Employee Not Found

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "data": null,
  "message": "Employee not found."
}
```

#### Validation Error

**Status Code:** `422 Unprocessable Entity`

```json
{
  "success": false,
  "data": null,
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
  "success": false,
  "data": null,
  "message": "Unable to update employee."
}
```

---

## 9. Backend Validation Requirements

All update requests must be validated on the backend.

Frontend validation is only for user experience. Backend validation is required for data integrity.

Recommended validation approach:

```text
app/Http/Requests/UpdateEmployeeRequest.php
```

Validation rules:

```php
[
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'max:255'],
    'isActive' => ['required', 'boolean'],
]
```

---

## 10. Backend Structure

Recommended Laravel structure:

```text
app/
  Http/
    Controllers/
      EmployeeController.php
    Requests/
      UpdateEmployeeRequest.php

  Models/
    Employee.php

  Services/
    EmployeeService.php

database/
  migrations/
    create_employees_table.php

routes/
  api.php
```

### 10.1 File Responsibilities

| File | Responsibility |
|---|---|
| EmployeeController.php | Handle API request and response |
| UpdateEmployeeRequest.php | Validate employee update request |
| EmployeeService.php | Handle employee business logic |
| Employee.php | Represent employee database model |
| create_employees_table.php | Create employees table |
| api.php | Define API routes |

---

## 11. Backend Error Handling

### 11.1 Shared API Response DTO

All API responses should use the shared `ApiResponse` DTO.

Shape:

```json
{
  "success": true,
  "data": null,
  "message": null
}
```

Behavior:

- `ApiResponse::successResponse(array $data = [], int $status = 200)` returns `success: true`, sets `data`, and leaves `message` as `null`.
- `ApiResponse::errorResponse(?string $message = null, int $status = 500)` returns `success: false`, sets `message`, and leaves `data` as `null`.

For success responses, `message` is `null`.
For error responses, `data` is `null`.

The backend should handle:

1. Employee not found.
2. Validation failure.
3. Server or database error.
4. Invalid request body.

Recommended HTTP status codes:

| Case | Status Code |
|---|---:|
| Success | 200 |
| Validation error | 422 |
| Employee not found | 404 |
| Server error | 500 |

---

## 12. CORS Requirement

The Laravel API must allow requests from the Next.js frontend during local development.

Example frontend local URL:

```text
http://localhost:3000
```

The exact CORS configuration depends on the Laravel version and project setup.

---

## 13. Environment Configuration

Laravel `.env` should contain the correct app and database configuration.

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

## 14. Backend Acceptance Criteria

The backend is considered complete when:

1. `GET /employees` returns a paginated JSON list of employees.
2. `PATCH /employees/{id}` updates an employee by ID.
3. PATCH request validates `name`, `email`, and `isActive`.
4. Invalid employee ID returns `404`.
5. Invalid request body returns `422`.
6. Successful update returns the updated employee data.
7. API response uses camelCase `isActive`.
8. Database can store employee active status as `is_active`.
9. API routes are defined clearly in Laravel.
10. Code follows the project `CODE_STYLE.md`.

---

## 15. Backend Testing Requirements

Recommended backend test cases:

1. Can retrieve employee list.
2. Can update employee name.
3. Can update employee email.
4. Can update employee active status.
5. Cannot update employee with invalid email.
6. Cannot update employee with missing name.
7. Cannot update employee with missing email.
8. Cannot update employee with invalid `isActive`.
9. Cannot update non-existing employee.
10. PATCH endpoint returns validation errors when required fields are missing.

---

## 16. Backend Deliverables

The backend should deliver:

1. Laravel API project.
2. Employee database migration.
3. Employee model.
4. Employee controller.
5. Employee update request validation.
6. Employee service class.
7. API routes:
   - `GET /employees`
   - `PATCH /employees/{id}`
8. Shared `ApiResponse` DTO.
9. Proper JSON responses.
10. Proper error handling.
