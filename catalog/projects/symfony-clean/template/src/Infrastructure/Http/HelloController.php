<?php

declare(strict_types=1);

namespace App\Infrastructure\Http;

use App\Application\Greet;

final class HelloController
{
    public function __construct(private readonly Greet $greet)
    {
    }

    public function handle(): string
    {
        return $this->greet->execute('world')->text;
    }
}
