import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalysisVersionEntity {
    @ApiProperty()
    uuid: string;

    @ApiPropertyOptional()
    ai_version: string | null;

    @ApiProperty()
    snapshot: Record<string, unknown>;

    @ApiProperty()
    created_at: Date;
}
