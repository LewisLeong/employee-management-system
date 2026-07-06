<?php

namespace App\Http\Controllers;

use App\DTOs\ApiResponse;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function __construct(private readonly EmployeeService $employeeService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $employees = $this->employeeService->list($request);

            return ApiResponse::successResponse([
                'employees' => $employees->items(),
                'meta' => [
                    'currentPage' => $employees->currentPage(),
                    'perPage' => $employees->perPage(),
                    'total' => $employees->total(),
                    'lastPage' => $employees->lastPage(),
                ],
            ]);
        } catch (\Throwable) {
            return ApiResponse::errorResponse('Unable to retrieve employees.');
        }
    }

    public function update(UpdateEmployeeRequest $request, int $id): JsonResponse
    {
        try {
            $employee = $this->employeeService->find($id);

            if ($employee === null) {
                return ApiResponse::errorResponse('Employee not found.', 404);
            }
            if (!$employee->is_active) {
                return ApiResponse::errorResponse('Cannot update an inactive employee.', 400);
            }

            $updatedEmployee = $this->employeeService->update($employee, $request->validated());

            return ApiResponse::successResponse([
                'employee' => $updatedEmployee,
            ]);
        } catch (\Throwable) {
            return ApiResponse::errorResponse('Unable to update employee.');
        }
    }
}
