<?php

declare(strict_types=1);

namespace Shared\Lib;

final class Assert
{
    public static function nonEmpty(string $value, string $message = 'Value must be non-empty'): string
    {
        if ($value === '') {
            throw new \InvalidArgumentException($message);
        }

        return $value;
    }
}
