<?php

declare(strict_types=1);

namespace App\Domains\Accounts\Domain;

final class AccountId
{
    public function __construct(public readonly string $value)
    {
        if ($value === '') {
            throw new \InvalidArgumentException('AccountId cannot be empty');
        }
    }
}
