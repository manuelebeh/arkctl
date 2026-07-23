<?php

declare(strict_types=1);

namespace App\Accounts\Controllers;

use App\Accounts\Models\Account;

final class AccountController
{
    public function show(string $id): Account
    {
        return new Account(id: $id, email: 'demo@example.com');
    }
}
