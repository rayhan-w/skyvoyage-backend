import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  officeAddress?: string;

  @IsOptional()
  @IsString()
  phoneHotline?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Valid supportEmail is required' })
  supportEmail?: string;

  @IsOptional()
  @IsString()
  bookingPhone?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  privacyPolicy?: string;

  @IsOptional()
  @IsString()
  termsConditions?: string;

  @IsOptional()
  @IsString()
  refundPolicy?: string;
}
