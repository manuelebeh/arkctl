<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\GreetService;

final class HelloController
{
    public function __construct(private readonly GreetService $greetService)
    {
    }

    public function greet(): string
    {
        return $this->greetService->greet('world');
    }
}
