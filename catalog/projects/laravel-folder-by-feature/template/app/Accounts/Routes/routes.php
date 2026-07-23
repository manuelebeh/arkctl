<?php

declare(strict_types=1);

// Public entrypoint for the Accounts feature.
// Wire these routes from your Laravel RouteServiceProvider / bootstrap.

use App\Accounts\Controllers\AccountController;

return [
    'GET /accounts/{id}' => [AccountController::class, 'show'],
];
