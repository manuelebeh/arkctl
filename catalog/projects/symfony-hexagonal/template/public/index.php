<?php

declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

use App\Application\Greet;
use App\Infrastructure\Http\HelloController;

echo (new HelloController(new Greet()))->handle() . PHP_EOL;
