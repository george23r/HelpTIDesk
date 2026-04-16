import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
  status?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;
}
