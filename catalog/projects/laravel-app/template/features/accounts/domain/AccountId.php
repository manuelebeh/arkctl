<?php

declare(strict_types=1);

namespace App\Features\Accounts\Domain;

final class AccountId
{
    public function __construct(public readonly string $value)
    {
    }
}
