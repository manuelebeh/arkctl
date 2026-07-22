<?php

declare(strict_types=1);

namespace App\Shared\Lib;

final class Assert
{
    public static function never(mixed $value): never
    {
        throw new \LogicException('Unexpected value: ' . get_debug_type($value));
    }
}
