<?php

declare(strict_types=1);

require dirname(__DIR__) . '/vendor/autoload.php';

use App\Controller\HelloController;
use App\Service\GreetService;

echo (new HelloController(new GreetService()))->greet() . PHP_EOL;
