<?php

declare(strict_types=1);

namespace App\Domains\Accounts\Application;

use App\Domains\Accounts\Domain\AccountId;

final class RegisterAccount
{
    public function __invoke(string $email): AccountId
    {
        return new AccountId(bin2hex(random_bytes(8)));
    }
}
