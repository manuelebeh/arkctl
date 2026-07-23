<?php

declare(strict_types=1);

namespace App\Features\RegisterAccount;

final class Controller
{
    public function __construct(private readonly Action $action) {}

    public function __invoke(Request $request): array
    {
        return ($this->action)($request->email);
    }
}
