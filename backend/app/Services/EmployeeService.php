<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EmployeeService
{
    public function find(int $id): ?Employee
    {
        return Employee::query()->find($id);
    }

    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return Employee::query()
            ->orderBy('id')
            ->paginate($perPage)
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
