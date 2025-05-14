<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Finance;
use App\Models\IncomeGoal;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

class FinanceControllerTest extends TestCase
{
    use RefreshDatabase; // This trait refreshes the database after each test

    /**
     * Test creating a finance record with associated income goals and expenses.
     */
    public function test_create_finance_record()
    {
        // Create an expense category for testing
        $category = ExpenseCategory::factory()->create();

        // Define the request payload
        $payload = [
            'budget' => 10000,
            'is_looking_for_investment' => true,
            'investment_amount' => 5000,
            'expected_return' => 15000,
            'income_goals' => [
                [
                    'title' => 'Goal 1',
                    'amount' => 5000,
                    'description' => 'First income goal',
                    'status' => 'pending',
                    'target_date' => '2023-12-31',
                ],
            ],
            'expenses' => [
                [
                    'name' => 'Expense 1',
                    'quantity' => 2,
                    'amount' => 100,
                    'description' => 'First expense',
                    'category_id' => $category->id,
                    'total_cost' => 200,
                ],
            ],
        ];

        // Send a POST request to the store endpoint
        $response = $this->postJson('/api/finances', $payload);

        // Assert that the response status is 201 (Created)
        $response->assertStatus(201);

        // Assert that the finance record was created
        $this->assertDatabaseHas('finances', [
            'budget' => 10000,
            'is_looking_for_investment' => true,
            'investment_amount' => 5000,
            'expected_return' => 15000,
        ]);

        // Assert that the income goal was created and associated with the finance record
        $finance = Finance::first();
        $this->assertDatabaseHas('income_goals', [
            'finance_id' => $finance->id,
            'income_goal_title' => 'Goal 1',
            'income_goal_amount' => 5000,
        ]);

        // Assert that the expense was created and associated with the finance record
        $this->assertDatabaseHas('expenses', [
            'finance_id' => $finance->id,
            'expense_name' => 'Expense 1',
            'expense_quantity' => 2,
            'expense_amount' => 100,
        ]);
    }

    /**
     * Test validation errors when creating a finance record.
     */
    public function test_validation_errors()
    {
        // Define an invalid payload (missing required fields)
        $payload = [
            'budget' => 'invalid', // Budget should be numeric
            'is_looking_for_investment' => 'invalid', // Should be boolean
            'income_goals' => [
                [
                    'title' => '', // Title is required
                    'amount' => 'invalid', // Amount should be numeric
                ],
            ],
            'expenses' => [
                [
                    'name' => '', // Name is required
                    'quantity' => 'invalid', // Quantity should be an integer
                ],
            ],
        ];

        // Send a POST request to the store endpoint
        $response = $this->postJson('/api/finances', $payload);

        // Assert that the response status is 422 (Unprocessable Entity)
        $response->assertStatus(422);

        // Assert that the response contains validation errors
        $response->assertJsonValidationErrors([
            'budget',
            'is_looking_for_investment',
            'income_goals.0.title',
            'income_goals.0.amount',
            'expenses.0.name',
            'expenses.0.quantity',
        ]);
    }
}
