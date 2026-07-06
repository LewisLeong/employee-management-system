<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class EmployeeService
{
    public function find(int $id): ?Employee
    {
        return Employee::query()->find($id);
    }

    public function list(Request $request): LengthAwarePaginator
    {
        $perPage = max(1, min((int) $request->integer('per_page', 15), 100));
        $page = max(1, (int) $request->integer('page', 1));
        $status = $request->input('status');
        $search = trim((string) $request->input('search', ''));

        return Employee::query()
            ->when($status !== null && $status !== '', function ($query) use ($status) {
                $query->where('is_active', filter_var($status, FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE));
            })
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('id')
            ->paginate($perPage, ['*'], 'page', $page)
            ->through(fn (Employee $employee) => $this->toApiArray($employee));
    }

    /**
     * @param array{name:string,email:string,isActive:bool} $data
     */
    public function update(Employee $employee, array $data): array
    {
        $employee->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => $data['isActive'],
        ]);

        $employee->save();

        return $this->toApiArray($employee->refresh());
    }

    private function toApiArray(Employee $employee): array
    {
        return [
            'id' => $employee->id,
            'name' => $employee->name,
            'email' => $employee->email,
            'isActive' => $employee->is_active,
        ];
    }
}
