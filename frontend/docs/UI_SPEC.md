# UI Specification

## Employee Toolbar

The employee page should include a filter toolbar above the table with:

- Search input for employee name or email
- Status filter control
- Rows per page selector

The toolbar should stay visually grouped as one control area.

The search input should only submit on blur or Enter.

The status filter should be shown as toggle buttons.

The rows-per-page control should stay aligned with the paginator controls.

## Employee Table

The employee table should show five columns:

- ID
- Name
- Email
- Status
- Actions

The Actions column must always be the rightmost column.

The Update button should only appear when the employee is active.

## Pagination

The employee list should use server-side numbered pagination.

The paginator should always remain visible, even when there is only one page.

The paginator should include:

- Previous button
- Next button
- Numbered page buttons
- Ellipses when the page range is large

## Update Modal

The modal should open when the user clicks Update.

The modal should contain:

- Name input
- Email input
- Active status switch row with a toggle and an `Active` / `Deactivated` label
- Save button
- Cancel button

The Save button should be disabled while the update request is loading.

The close button should be an `X` icon button.

When the user submits a deactivation, the modal should show a confirmation prompt before the save continues.

After a successful save, the modal should briefly show a success message before closing itself.
