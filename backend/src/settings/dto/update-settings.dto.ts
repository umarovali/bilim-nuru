import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsString() @IsOptional() siteName?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() email?: string;
  @IsString() @IsOptional() instagram?: string;
  @IsString() @IsOptional() facebook?: string;
  @IsString() @IsOptional() whatsapp?: string;
  @IsString() @IsOptional() workingHours?: string;
}
