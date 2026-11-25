import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'mobile is required' })
  mobile: string;

  @IsEmail({}, { message: 'Valid email is required' })
  email: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsString()
  @IsNotEmpty({ message: 'message is required' })
  message: string;
}
