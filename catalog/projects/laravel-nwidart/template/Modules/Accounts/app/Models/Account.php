<?php

declare(strict_types=1);

namespace Modules\Accounts\Models;

final class Account
{
    public function __construct(
        public readonly string $id,
        public readonly string $email,
    ) {}
}
