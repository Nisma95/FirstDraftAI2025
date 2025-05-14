<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Plan;
use Illuminate\Auth\Access\HandlesAuthorization;

class PlanPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Plan $plan)
    {
        return $user->id === $plan->project->user_id;
    }

    public function update(User $user, Plan $plan)
    {
        return $user->id === $plan->project->user_id;
    }

    public function delete(User $user, Plan $plan)
    {
        return $user->id === $plan->project->user_id;
    }
}
