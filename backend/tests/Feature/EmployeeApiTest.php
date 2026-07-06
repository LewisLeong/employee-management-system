<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_employee_list(): void
    {
        for ($i = 1; $i <= 16; $i++) {
            Employee::query()->create([
                'name' => "Employee {$i}",
                'email' => "employee{$i}@ayp-group.com",
                'is_active' => $i % 2 === 1,
            ]);
        }

        $response = $this->getJson('/api/employees');

        $response->assertOk()
            ->assertJson([
                'employees' => [
                    [
                        'id' => 1,
                        'name' => 'Employee 1',
                        'email' => 'employee1@ayp-group.com',
                        'isActive' => true,
                    ],
                ],
                'meta' => [
                    'currentPage' => 1,
                    'perPage' => 15,
                    'total' => 16,
                    'lastPage' => 2,
                ],
            ]);
    }

    public function test_it_updates_an_employee(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/employees/{$employee->id}", [
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'isActive' => false,
        ]);

        $response->assertOk()
            ->assertJson([
                'employee' => [
                    'id' => $employee->id,
                    'name' => 'John Updated',
                    'email' => 'john.updated@ayp-group.com',
                    'isActive' => false,
                ],
                'message' => 'Employee updated successfully.',
            ]);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'is_active' => 0,
        ]);
    }

    public function test_it_returns_validation_errors_for_invalid_update_payload(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/employees/{$employee->id}", [
            'name' => '',
            'email' => 'not-an-email',
            'isActive' => 'nope',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'isActive']);
    }

    public function test_it_requires_all_update_fields(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/employees/{$employee->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'isActive']);
    }

    public function test_it_enforces_max_lengths_on_update_fields(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->patchJson("/api/employees/{$employee->id}", [
            'name' => str_repeat('a', 256),
            'email' => str_repeat('b', 247).'@example.com',
            'isActive' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_it_returns_not_found_for_missing_employee(): void
    {
        $response = $this->patchJson('/api/employees/999999', [
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'isActive' => false,
        ]);

        $response->assertNotFound()
            ->assertJson([
                'message' => 'Employee not found.',
            ]);
    }

    public function test_it_returns_server_error_when_update_fails(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $service = $this->mock(\App\Services\EmployeeService::class);
        $service->shouldReceive('find')
            ->once()
            ->with($employee->id)
            ->andReturn($employee);
        $service->shouldReceive('update')
            ->once()
            ->andThrow(new \RuntimeException('Boom'));

        $response = $this->patchJson("/api/employees/{$employee->id}", [
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'isActive' => false,
        ]);

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'Unable to update employee.',
            ]);
    }
}
