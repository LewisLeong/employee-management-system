# Backend Rules

## 1. Purpose

This document defines the development rules for the Laravel backend API.

The backend must follow:

```text
BACKEND_PRD.md
CODE_STYLE.md
```

---

## 2. Dependency Rule

Do **not** install any additional dependencies or third-party packages unless explicitly approved.

The backend must be built using only the base dependencies that come with a standard Laravel installation.

Use Laravel’s built-in features whenever possible.

---

## 3. Allowed Backend Features

Allowed Laravel built-in features:

- Routes
- Controllers
- Form Requests
- Eloquent Models
- Migrations
- Seeders
- Factories, if already included
- Query Builder
- Laravel validation
- Laravel JSON responses
- Laravel exception handling
- Laravel CORS configuration
- Environment variables

---

## 4. Not Allowed Without Approval

Do not install packages such as:

- Laravel Sanctum
- Laravel Passport
- Socialite
- JWT packages
- Spatie Permission
- Laravel Nova
- Filament
- Laravel Data
- Fractal
- Debugbar
- Telescope
- External validation packages
- External ORM or database packages

Authentication is outside the current scope.

Do not add authentication unless explicitly requested.

---

## 5. API Scope Rule

Only implement the API endpoints required by `BACKEND_PRD.md`.

Required endpoints:

```text
GET /employees
PATCH /employees/{id}
```

Do not create extra endpoints unless explicitly requested.

Do not add these unless requested:

```text
POST /employees
GET /employees/{id}
PUT /employees/{id}
DELETE /employees/{id}
```

---

## 6. Backend Architecture Rule

The backend should follow an OOP-friendly Laravel structure.

Recommended flow:

```text
Route
→ Controller
→ Form Request
→ Service
→ Model
→ Database
```

Recommended files:

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

routes/
  api.php
```

---

## 7. Controller Rule

Controllers should be thin.

Controllers should only:

- Receive the request
- Call the correct service method
- Return the response

Do not place heavy business logic directly inside controllers.

---

## 8. Service Rule

Business logic should be placed inside service classes.

For employee-related business logic, use:

```text
app/Services/EmployeeService.php
```

The service may handle:

- Getting employee list
- Finding employee by ID
- Updating employee data
- Formatting employee response data

---

## 9. Validation Rule

Use Laravel’s built-in validation system.

Recommended:

```text
app/Http/Requests/UpdateEmployeeRequest.php
```

Required PATCH validation:

```php
[
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'max:255'],
    'isActive' => ['required', 'boolean'],
]
```

Do not use external validation packages.

---

## 10. Database Rule

Use Laravel’s built-in database features.

Allowed:

- Eloquent Model
- Migration
- Seeder
- Factory, if already included
- Query Builder

The employees table should use:

```text
is_active
```

The API response should expose:

```text
isActive
```

---

## 11. Response Format Rule

The API must return JSON.

Employee list response:

```json
{
  "employees": []
}
```

Update response:

```json
{
  "employee": {},
  "message": "Employee updated successfully."
}
```

Error response:

```json
{
  "message": "Employee not found."
}
```

---

## 12. Error Handling Rule

The backend must handle:

- Employee not found
- Validation error
- Server error
- Invalid request data

Use suitable HTTP status codes:

| Case | Status Code |
|---|---:|
| Success | 200 |
| Validation error | 422 |
| Employee not found | 404 |
| Server error | 500 |

---

## 13. Environment Rule

Use Laravel `.env` for environment-specific values.

Do not hardcode database credentials or environment-specific URLs.

Do not commit `.env`.

Commit `.env.example` if needed.

---

## 14. Git Rule

Do not commit:

- `.env`
- `vendor/`
- Local database files
- Log files
- Cache files
- Temporary files

Backend `.gitignore` should ignore:

```gitignore
/vendor
.env
.env.*
!.env.example
/storage/*.key
/storage/logs/*
/storage/framework/cache/*
/storage/framework/sessions/*
/storage/framework/views/*
/bootstrap/cache/*.php
*.sqlite
*.sqlite-journal
*.log
.DS_Store
Thumbs.db
.vscode/
.idea/
```

---

## 15. Final Backend Rule

When choosing between adding a package and using Laravel’s built-in features, use Laravel’s built-in features.

Dependencies are not allowed unless the project owner explicitly approves them.
