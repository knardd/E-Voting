<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// 1. Muat Autoloader Composer
require __DIR__ . '/../vendor/autoload.php';

// 2. Inisialisasi Aplikasi Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';

// 3. Buat folder temporary di /tmp untuk Vercel (read-only filesystem)
$storageFolders = [
    '/tmp/storage/app/public',
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/bootstrap/cache',
];

foreach ($storageFolders as $folder) {
    if (!is_dir($folder)) {
        mkdir($folder, 0755, true);
    }
}

// 4. Set path storage ke /tmp
$app->useStoragePath('/tmp/storage');

// 5. Tangani dan kirim response HTTP
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);