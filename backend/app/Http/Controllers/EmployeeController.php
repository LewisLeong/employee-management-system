<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    public function __construct(private readonly EmployeeService $employeeService)
    {
    }

    public function index(): JsonResponse
    {
        try {
            $employees = $this->employeeService->list();

            return response()->json([
                'employees' => $employees->items(),
                'meta' => [
                    'currentPage' => $employees->currentPage(),
                    'perPage' => $employees->perPage(),
                    'total' => $employees->total(),
                    'lastPage' => $employees->lastPage(),
                ],
            ]);
        } catch (\Throwable) {
            return response()->json([
                'message' => 'Unable to retrieve employees.',
            ], 500);
        }
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        try {
            $employee = $this->employeeService->find($id);

            if ($employee === null) {
                return response()->json([
                    'message' => 'Employee not found.',
                ], 404);
            }

            $updatedEmployee = $this->employeeService->update($employee, $request->validated());

            return response()->json([
                'employee' => $updatedEmployee,
                'message' => 'Employee updated successfully.',
            ]);
        } catch (\Throwable) {
            return response()->json([
                'message' => 'Unable to update employee.',
            ], 500);
        }
    }
}
