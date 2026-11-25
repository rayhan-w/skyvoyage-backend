import { QueryStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReplyQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'reply is required' })
  reply: string;

  @IsOptional()
  @IsEnum(QueryStatus, { message: 'status must be NEW, REPLIED, or CLOSED' })
  status?: QueryStatus;
}
