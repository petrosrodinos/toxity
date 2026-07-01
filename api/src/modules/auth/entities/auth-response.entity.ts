import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
    @ApiProperty({
        description: 'JWT access token for authentication',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    access_token: string;

    @ApiProperty({
        description: 'Access token expiration time (Unix timestamp)',
        example: 1719859200,
    })
    expires_in: number;

    @ApiProperty({
        description: 'User information (password never included)',
        type: 'object',
        properties: {
            uuid: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            email: { type: 'string', example: 'user@example.com' },
            phone: { type: 'string', example: '+1234567890', nullable: true },
            name: { type: 'string', example: 'Jane Doe', nullable: true },
            created_at: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            updated_at: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
    })
    user: Record<string, unknown>;
}
