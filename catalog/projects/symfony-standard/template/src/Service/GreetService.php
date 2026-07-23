<?php

declare(strict_types=1);

namespace App\Service;

final class GreetService
{
    public function greet(string $name): string
    {
        return 'Hello, ' . $name;
    }
}
