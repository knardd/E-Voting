<?php

// Forward request ke public/index.php
define('LARAVEL_START', microtime(true));

// Pastikan direktori storage ephemeral tersedia di /tmp
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

// Override path storage dan bootstrap cache ke /tmp
app()->useStoragePath('/tmp/storage');
app()->useBootstrapPath('/tmp/storage/bootstrap');

require __DIR__ . '/../public/index.php';