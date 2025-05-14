<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $plan_name }} - Business Plan</title>
    <style>
        /* Base Styles */
        body {
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fafafa;
            margin: 0;
            padding: 0;
        }

        /* Container */
        .container {
            width: 95%;
            margin: 40px auto;
            padding: 30px;
            background-color: #fff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 16px;
        }

        /* Header */
        h1 {
            color: #5956e9;
            text-align: center;
            font-size: 28px;
            text-transform: uppercase;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 3px solid #5956e9;
        }

        /* Sections */
        .section {
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 35px;
            border-radius: 16px;
            padding: 20px;
        }

        /* Section headers */
        .section h2 {
            color: #5956e9;
            border-bottom: 2px solid #6077a1;
            padding-bottom: 10px;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 20px;
        }

        /* Data rows */
        .data-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f0f0f0;
            padding: 10px 0;
            margin-bottom: 5px;
        }

        .data-label {
            font-weight: bold;
            width: 40%;
            color: #2c2b2b;
        }

        .data-value {
            width: 60%;
        }

        /* Finance metrics */
        .finance-metrics {
            background-color: #e8f5e9;
            padding: 20px;
            border-radius: 16px;
            margin-top: 15px;
            border-left: 4px solid #5956e9;
        }

        /* Table styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }

        thead tr {
            background-color: #5956e9;
            color: white;
        }

        th {
            padding: 12px 15px;
            text-align: left;
            font-weight: bold;
        }

        td {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
        }

        tr:hover {
            background-color: #f9f9f9;
        }

        /* Badge styling */
        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
        }

        .badge-blue {
            background-color: #2196f3;
            color: #fff;
        }

        .badge-pink {
            background-color: #e91e63;
            color: #fff;
        }

        .badge-green {
            background-color: #4caf50;
            color: #fff;
        }

        .badge-orange {
            background-color: #ff9800;
            color: #fff;
        }

        /* Summary box */
        .summary-box {
            background-color: #e8f5e9;
            color: #333;
            padding: 20px;
            border-radius: 16px;
            margin-top: 15px;
            border-left: 4px solid #4caf50;
        }

        .summary-box .data-label {
            color: #333;
        }

        /* Alerts */
        .alert {
            padding: 15px;
            border-radius: 16px;
            margin: 15px 0;
            text-align: center;
        }

        .alert-info {
            background-color: #e3f2fd;
            color: #0d47a1;
            border-left: 4px solid #2196f3;
        }

        .alert-warning {
            background-color: #fff3e0;
            color: #e65100;
            border-left: 4px solid #ff9800;
        }

        .alert-success {
            background-color: #e8f5e9;
            color: #1b5e20;
            border-left: 4px solid #4caf50;
        }

        /* Footer */
        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 40px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }

        /* Print Optimizations */
        @media print {
            body {
                background: white;
            }

            .container {
                width: 100%;
                margin: 0;
                padding: 10px;
                box-shadow: none;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>{{ $plan_name }} - Business Plan</h1>

        <!-- Basic Plan Information -->
        <div class="section">
            <h2>Plan Overview</h2>

            <div class="data-row">
                <div class="data-label">Plan Name:</div>
                <div class="data-value">{{ $plan_name }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Purpose:</div>
                <div class="data-value">{{ $plan_purpose }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Existing Business:</div>
                <div class="data-value">
                    @if($is_existed == 'Yes' || $is_existed == 1)
                    <span class="badge badge-blue">Yes</span>
                    @else
                    <span class="badge badge-orange">No</span>
                    @endif
                </div>
            </div>

            <div class="data-row">
                <div class="data-label">Industry:</div>
                <div class="data-value">{{ $industry }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Business Type:</div>
                <div class="data-value">{{ $business_type }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Target Audience:</div>
                <div class="data-value">{{ $audience }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Creation Date:</div>
                <div class="data-value">{{ $created_at }}</div>
            </div>
        </div>

        <!-- Finance Details -->
        <div class="section">
            <h2>Financial Overview</h2>

            <div class="finance-metrics">
                <div class="data-row">
                    <div class="data-label">Initial Budget:</div>
                    <div class="data-value">${{ number_format($budget, 2) }}</div>
                </div>

                <div class="data-row">
                    <div class="data-label">Seeking Investment:</div>
                    <div class="data-value">
                        @if($is_looking_for_investment == 'Yes' || $is_looking_for_investment == 1)
                        <span class="badge badge-green">Yes</span>
                        @else
                        <span class="badge badge-blue">No</span>
                        @endif
                    </div>
                </div>

                @if($is_looking_for_investment == 'Yes' || $is_looking_for_investment == 1)
                <div class="data-row">
                    <div class="data-label">Investment Amount:</div>
                    <div class="data-value">${{ number_format($investment_amount, 2) }}</div>
                </div>

                <div class="data-row">
                    <div class="data-label">Expected Return:</div>
                    <div class="data-value">{{ $expected_return }}%</div>
                </div>
                @endif
            </div>
        </div>

        <!-- Income Goals -->
        <div class="section">
            <h2>Income Goals</h2>

            <div class="data-row">
                <div class="data-label">Goal Title:</div>
                <div class="data-value">{{ $income_goal_title }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Target Amount:</div>
                <div class="data-value">${{ number_format($income_goal_amount, 2) }}</div>
            </div>

            <div class="data-row">
                <div class="data-label">Status:</div>
                <div class="data-value">
                    @if($income_goal_status == 'Completed')
                    <span class="badge badge-green">{{ $income_goal_status }}</span>
                    @elseif($income_goal_status == 'In Progress')
                    <span class="badge badge-blue">{{ $income_goal_status }}</span>
                    @else
                    <span class="badge badge-orange">{{ $income_goal_status }}</span>
                    @endif
                </div>
            </div>

            <div class="data-row">
                <div class="data-label">Target Date:</div>
                <div class="data-value">{{ $income_goal_target_date }}</div>
            </div>

            @if(isset($income_goal_description) && $income_goal_description != 'N/A')
            <div class="data-row">
                <div class="data-label">Description:</div>
                <div class="data-value">{{ $income_goal_description }}</div>
            </div>
            @endif
        </div>

        <!-- Expenses Section -->
        <div class="section">
            <h2>Expenses</h2>

            @if(isset($expenses) && !empty($expenses) && count($expenses) > 0)
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($expenses as $expense)
                    @if(isset($expense->name) && !empty($expense->name) && $expense->name != 'Default Expense' && $expense->name != 'Additional Expense')
                    <tr>
                        <td>{{ $expense->name ?? 'N/A' }}</td>
                        <td>
                            @if(isset($expense->category) && is_object($expense->category))
                            {{ $expense->category->category_name ?? 'N/A' }}
                            @else
                            N/A
                            @endif
                        </td>
                        <td>{{ isset($expense->quantity) ? $expense->quantity : 1 }}</td>
                        <td>${{ number_format(isset($expense->amount) ? $expense->amount : 0, 2) }}</td>
                        <td>${{ number_format(isset($expense->total_cost) ? $expense->total_cost : ((isset($expense->amount) ? $expense->amount : 0) * (isset($expense->quantity) ? $expense->quantity : 1)), 2) }}</td>
                    </tr>
                    @endif
                    @endforeach
                </tbody>
            </table>

            <!-- Expenses Summary -->
            <div class="summary-box">
                <div class="data-row" style="border-bottom: none;">
                    <div class="data-label">Total Expenses:</div>
                    <div class="data-value">
                        @php
                        $totalExpenses = 0;
                        foreach($expenses as $expense) {
                        if(isset($expense->name) && !empty($expense->name) && $expense->name != 'Default Expense' && $expense->name != 'Additional Expense') {
                        $amount = isset($expense->amount) ? $expense->amount : 0;
                        $quantity = isset($expense->quantity) ? $expense->quantity : 1;
                        $totalExpenses += isset($expense->total_cost) ? $expense->total_cost : ($amount * $quantity);
                        }
                        }
                        @endphp
                        ${{ number_format($totalExpenses, 2) }}
                    </div>
                </div>
            </div>
            @else
            <div class="alert alert-info">
                <p style="margin: 0">No expenses have been recorded yet.</p>
            </div>
            @endif
        </div>

        <!-- Staff Section -->
        <div class="section">
            <h2>Staff Information</h2>

            @if($is_self_managed)
            <div class="alert alert-info">
                <p style="margin: 0; font-weight: bold;">This business will be self-managed.</p>
            </div>
            @elseif(!empty($staff_members))
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Salary</th>
                        <th>Region</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($staff_members as $staff)
                    <tr>
                        <td style="font-weight: bold;">{{ isset($staff['staff_name']) ? $staff['staff_name'] : $staff->staff_name ?? 'N/A' }}</td>
                        <td>{{ isset($staff['staff_role']) ? $staff['staff_role'] : $staff->staff_role ?? 'N/A' }}</td>
                        <td>${{ number_format(isset($staff['staff_salary']) ? $staff['staff_salary'] : $staff->staff_salary ?? 0, 2) }}</td>
                        <td>
                            @php
                            $region = isset($staff['staff_region']) ? $staff['staff_region'] : $staff->staff_region ?? 'N/A';
                            @endphp
                            <span class="badge {{ $region == 'Local' ? 'badge-blue' : 'badge-pink' }}">
                                {{ $region }}
                            </span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <!-- Staff Summary Box -->
            <div class="summary-box">
                <div class="data-row">
                    <div class="data-label">Total Staff:</div>
                    <div class="data-value">{{ count($staff_members) }} members</div>
                </div>
                <div class="data-row">
                    <div class="data-label">Monthly Salary Expense:</div>
                    <div class="data-value">
                        @php
                        $totalSalary = 0;
                        foreach($staff_members as $staff) {
                        $salary = isset($staff['staff_salary']) ? $staff['staff_salary'] : (isset($staff->staff_salary) ? $staff->staff_salary : 0);
                        $totalSalary += $salary;
                        }
                        @endphp
                        ${{ number_format($totalSalary, 2) }}
                    </div>
                </div>
                <div class="data-row" style="border-bottom: none;">
                    <div class="data-label">Annual Salary Expense:</div>
                    <div class="data-value">${{ number_format($totalSalary * 12, 2) }}</div>
                </div>
            </div>
            @else
            <div class="alert alert-warning">
                <p style="margin: 0;">No staff information available. Please add staff to complete your business plan.</p>
            </div>
            @endif
        </div>

        <!-- Add this section to your resources/views/HtmlPdfs/business_plan.blade.php -->

        <!-- After your existing content, add: -->
        @if(isset($ai_analysis) && !empty($ai_analysis))
        <div class="page-break"></div>
        <div class="section">
            <h2>AI Business Plan Analysis</h2>
            <div class="analysis-content">
                {!! nl2br(e($ai_analysis)) !!}
            </div>
        </div>
        @endif

        <style>
            .page-break {
                page-break-before: always;
            }

            .analysis-content {
                margin-top: 15px;
                line-height: 1.6;
                font-size: 12px;
            }
        </style>

        <div class="footer">
            <p>This business plan was generated on {{ $created_at }}</p>
            <p>&copy; {{ date('Y') }} Your Business Plan Generator</p>
        </div>
    </div>
</body>

</html>