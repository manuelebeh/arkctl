<?php

declare(strict_types=1);

namespace App\Accounts\Models;

final class Account
{
    public function __construct(
        public readonly string $id,
        public readonly string $email,
    ) {}
}
