<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.api.bearer_token', 'test-token');
    }

    public function test_it_returns_employee_list(): void
    {
        for ($i = 1; $i <= 16; $i++) {
            Employee::query()->create([
                'name' => "Employee {$i}",
                'email' => "employee{$i}@ayp-group.com",
                'is_active' => $i % 2 === 1,
            ]);
        }

        $response = $this->withToken('test-token')->getJson('/api/employees');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
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
                ],
            ]);
    }

    public function test_it_filters_employee_list_by_status(): void
    {
        Employee::query()->create([
            'name' => 'Active Employee',
            'email' => 'active@example.com',
            'is_active' => true,
        ]);

        Employee::query()->create([
            'name' => 'Inactive Employee',
            'email' => 'inactive@example.com',
            'is_active' => false,
        ]);

        $response = $this->withToken('test-token')->getJson('/api/employees?status=1');

        $response->assertOk()
            ->assertJsonCount(1, 'data.employees')
            ->assertJsonPath('data.employees.0.name', 'Active Employee');
    }

    public function test_it_filters_employee_list_by_search(): void
    {
        Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        Employee::query()->create([
            'name' => 'Jane Doe',
            'email' => 'jane@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->withToken('test-token')->getJson('/api/employees?search=jane');

        $response->assertOk()
            ->assertJsonCount(1, 'data.employees')
            ->assertJsonPath('data.employees.0.name', 'Jane Doe');
    }

    public function test_it_honors_custom_per_page_and_page_parameters(): void
    {
        for ($i = 1; $i <= 7; $i++) {
            Employee::query()->create([
                'name' => "Employee {$i}",
                'email' => "employee{$i}@example.com",
                'is_active' => true,
            ]);
        }

        $response = $this->withToken('test-token')->getJson('/api/employees?per_page=5&page=2');

        $response->assertOk()
            ->assertJsonPath('data.meta.perPage', 5)
            ->assertJsonPath('data.meta.currentPage', 2)
            ->assertJsonPath('data.meta.total', 7)
            ->assertJsonCount(2, 'data.employees');
    }

    public function test_it_updates_an_employee(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->withToken('test-token')->patchJson("/api/employees/{$employee->id}", [
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'isActive' => false,
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'employee' => [
                        'id' => $employee->id,
                        'name' => 'John Updated',
                        'email' => 'john.updated@ayp-group.com',
                        'isActive' => false,
                    ],
                ],
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

        $response = $this->withToken('test-token')->patchJson("/api/employees/{$employee->id}", [
            'name' => '',
            'email' => 'not-an-email',
            'isActive' => 'nope',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'isActive']);
    }

    public function test_it_rejects_email_without_a_dot_domain(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->withToken('test-token')->patchJson("/api/employees/{$employee->id}", [
            'name' => 'John Smith',
            'email' => '123@123',
            'isActive' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_it_requires_all_update_fields(): void
    {
        $employee = Employee::query()->create([
            'name' => 'John Smith',
            'email' => 'john@ayp-group.com',
            'is_active' => true,
        ]);

        $response = $this->withToken('test-token')->patchJson("/api/employees/{$employee->id}", []);

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

        $response = $this->withToken('test-token')->patchJson("/api/employees/{$employee->id}", [
            'name' => str_repeat('a', 256),
            'email' => str_repeat('b', 247).'@example.com',
            'isActive' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_it_returns_not_found_for_missing_employee(): void
    {
        $response = $this->withToken('test-token')->patchJson('/api/employees/999999', [
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'isActive' => false,
        ]);

        $response->assertNotFound()
            ->assertJson([
                'success' => false,
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

        $response = $this->withToken('test-token')->patchJson("/api/employees/{$employee->id}", [
            'name' => 'John Updated',
            'email' => 'john.updated@ayp-group.com',
            'isActive' => false,
        ]);

        $response->assertStatus(500)
            ->assertJson([
                'success' => false,
                'message' => 'Unable to update employee.',
            ]);
    }

    public function test_it_rejects_missing_bearer_token(): void
    {
        $response = $this->getJson('/api/employees');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized.',
            ]);
    }
}
