<?php

namespace App\Http\Middleware;

use App\DTOs\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $expectedToken = (string) config('services.api.bearer_token', '');
        $providedToken = $request->bearerToken();

        if ($expectedToken != $providedToken) {
            return ApiResponse::errorResponse('Unauthorized.', 401);
        }

        return $next($request);
    }
}
