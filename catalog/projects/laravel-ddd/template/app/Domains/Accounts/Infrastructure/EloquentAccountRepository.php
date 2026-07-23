<?php

declare(strict_types=1);

namespace App\Domains\Accounts\Infrastructure;

use App\Domains\Accounts\Domain\AccountId;

final class EloquentAccountRepository
{
    public function nextIdentity(): AccountId
    {
        return new AccountId(bin2hex(random_bytes(8)));
    }
}
