<?php

declare(strict_types=1);

namespace App\Domain;

final readonly class Greeting
{
    public function __construct(public string $text)
    {
    }
}
