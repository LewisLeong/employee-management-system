# Development Rules

## 1. Dependency Rule

Do **not** install any additional dependencies or third-party packages unless explicitly approved.

The project must be built using only the base dependencies that come with the selected frameworks:

- Laravel default installation dependencies
- Next.js default installation dependencies
- React dependencies included by Next.js
- TypeScript dependencies included by the framework setup, if TypeScript is selected

No extra UI libraries, state management libraries, form libraries, validation libraries, table libraries, modal libraries, icon libraries, or utility packages should be installed.

---

## 2. Frontend Rules

### 2.1 Framework

The frontend must use:

- Next.js
- React
- TypeScript, if the project is initialized with TypeScript

### 2.2 Styling

Use only the styling method already included in the base Next.js setup.

Allowed approaches:

- Plain CSS
- CSS Modules
- Global CSS
- Inline styles, only when reasonable

Do not install styling libraries such as:

- Tailwind CSS, unless it is already part of the initial project setup
- Bootstrap
- Material UI
- Ant Design
- Chakra UI
- Mantine
- Styled Components
- Emotion

### 2.3 Components

All UI components must be built manually.

This includes:

- Table
- Modal
- Text input
- Switch
- Button
- Status badge
- Loading state
- Error message

Do not install component libraries.

### 2.4 Table

The employee table must be implemented using native HTML table elements or custom React components.

Do not install table libraries such as:

- TanStack Table
- React Table
- AG Grid
- DataTables
- Material React Table

### 2.5 Modal

The update modal must be implemented manually using React state and standard HTML/CSS.

Do not install modal libraries.

### 2.6 Form Handling

Form state and validation must be implemented manually using React state.

Do not install form libraries such as:

- React Hook Form
- Formik
- Final Form

### 2.7 Validation

Frontend validation must be implemented manually.

Do not install validation libraries such as:

- Yup
- Zod
- Joi

---

## 3. Backend Rules

### 3.1 Framework

The backend must use:

- PHP Laravel
- Laravel’s default built-in features

### 3.2 API

Use Laravel’s built-in routing, controller, request validation, model, migration, and resource features.

Do not install additional API packages.

### 3.3 Validation

Backend validation must use Laravel’s built-in validation system.

Allowed:

- Form Request classes
- `$request->validate()`
- Laravel validation rules

Do not install external validation packages.

### 3.4 Database

Use Laravel’s built-in database features.

Allowed:

- Eloquent Model
- Migration
- Seeder
- Factory, if already included
- Query Builder

Do not install extra ORM or database abstraction packages.

### 3.5 Authentication

Authentication is outside the current project scope.

Do not install authentication packages unless explicitly requested.

Do not install:

- Laravel Sanctum
- Laravel Passport
- Socialite
- JWT packages

---

## 4. API Rules

The backend must provide only the required minimum API endpoints unless additional endpoints are explicitly requested.

Required endpoints:

```text
GET /employees
PATCH /employees/{id}
```

Do not create extra endpoints such as:

```text
POST /employees
DELETE /employees/{id}
GET /employees/{id}
```

unless explicitly requested.

---

## 5. Data Rules

The employee data structure must follow the PRD.

Expected API response format:

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

The frontend should use camelCase:

```ts
isActive
```

The backend database may use snake_case:

```php
is_active
```

If the database uses `is_active`, the API response must map it to `isActive`.

---

## 6. Code Style Rules

### 6.1 Keep Code Simple

Write clear and readable code.

Avoid unnecessary abstraction.

Do not over-engineer the project.

### 6.2 Component Responsibility

Each component should have a clear responsibility.

Recommended frontend components:

```text
EmployeeTable
EmployeeUpdateModal
EmployeeStatusBadge
EmployeeActions
```

### 6.3 API Logic

Keep API request logic separate from UI components where reasonable.

Example:

```text
lib/api/employees.ts
```

### 6.4 No Unused Code

Do not leave unused functions, unused imports, commented-out code, or unused files.

---

## 7. UI/UX Rules

The UI should be clean, simple, and suitable for an employee management screen.

The design should prioritize:

- Readability
- Clear actions
- Simple form flow
- Good spacing
- Clear loading states
- Clear error states

Do not copy the illustration exactly.

The illustration is only a functional reference.

---

## 8. Performance Rules

The frontend table should support up to 1,000 employee records.

Because no extra dependencies are allowed:

- Avoid unnecessary re-renders
- Use stable keys, such as `employee.id`
- Keep rendering logic simple
- Avoid expensive calculations during render
- Use basic pagination only if needed, implemented manually

Do not install virtualization or pagination libraries.

---

## 9. Error Handling Rules

The app must handle:

- Employee list loading error
- Employee update error
- Validation error
- Empty employee list
- Employee not found response

Do not ignore API errors.

Do not silently fail.

---

## 10. Environment Rules

Use environment variables for API base URL.

Frontend example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Do not hardcode production API URLs directly inside components.

---

## 11. Git / Project Hygiene Rules

Do not commit:

- `.env`
- `node_modules`
- `vendor`
- build output folders
- temporary files
- local database files, unless explicitly required

Keep the repository clean and focused on source code.

---

## 12. Final Rule

When choosing between adding a dependency and writing simple custom code, always choose simple custom code.

Dependencies are not allowed unless the project owner explicitly approves them.
