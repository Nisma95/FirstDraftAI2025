<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log; // Optional but helpful for logging
use Illuminate\Support\Facades\DB;   // For transactions like DB::beginTransaction()

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    // You can add common methods or helpers here if needed
}
