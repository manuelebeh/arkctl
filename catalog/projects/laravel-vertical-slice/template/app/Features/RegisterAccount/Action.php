<?php

declare(strict_types=1);

namespace App\Features\RegisterAccount;

final class Action
{
    public function __invoke(string $email): array
    {
        return [
            'email' => $email,
            'status' => 'registered',
        ];
    }
}
