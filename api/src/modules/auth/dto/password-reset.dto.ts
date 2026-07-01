import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ description: 'Password reset token from email link' })
    @IsString()
    token: string;

    @ApiProperty({ minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;
}
