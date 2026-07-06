import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateMailDto {

    @IsString()
    to: string;

    @IsString()
    subject: string;

    @IsString()
    text: string;

    @IsOptional()
    from?: string;

    @IsOptional()
    html?: any;

    @IsOptional()
    attachments?: any[];

    @IsOptional()
    cc?: string[];

    @IsOptional()
    bcc?: string[];

    @IsOptional()
    replyTo?: string;


    @IsOptional()
    headers?: Record<string, string>;
}
