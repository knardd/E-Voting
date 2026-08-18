<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoCache
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        //no-store & no-cache: Melarang browser menyimpan halaman & wajib validasi ke server.
        //must-revalidate: Memastikan browser memeriksa ulang ke server jika ada cache tersisa.
        $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');

        //Pragma: Fallback anti-cache untuk browser jadul (HTTP/1.0 / Internet Explorer).
        $response->headers->set('Pragma', 'no-cache');

        //Expires: Set status konten langsung kedaluwarsa (basi) di detik itu juga.
        $response->headers->set('Expires', '0');
        
        return $response;
    }
}
