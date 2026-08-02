import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  studentsCount?: number;

  @IsNumber()
  @IsOptional()
  teachersCount?: number;

  @IsNumber()
  @IsOptional()
  coursesCount?: number;

  @IsNumber()
  @IsOptional()
  yearsOnMarket?: number;
}
