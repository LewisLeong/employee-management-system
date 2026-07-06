<?php

namespace App\DTOs;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public function __construct(
        public readonly bool $success,
        public readonly ?array $data = null,
        public readonly ?string $message = null,
    ) {
    }
    public static function errorMessage(): string
    {
        return 'Something went wrong.';
    }

    public static function successResponse(array $data = [], int $status = 200): JsonResponse
    {
        return response()->json(new self(
            success: true,
            data: $data
        ), $status);
    }

    public static function errorResponse(?string $message = null, int $status = 500): JsonResponse
    {
        return response()->json(new self(
            success: false,
            message: $message ?? self::errorMessage(),
        ), $status);
    }
}
