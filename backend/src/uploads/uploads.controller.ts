import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // Admin only: upload an image file, stored directly in MongoDB
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не был отправлен');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Можно загружать только изображения');
    }
    const media = await this.uploadsService.save(file);
    // Relative path — the frontend prefixes it with VITE_API_URL to get a full <img src>
    return { url: `/uploads/${media._id}` };
  }

  // Public: serves the stored image bytes so it can be used directly in <img src>
  @Get(':id')
  async serve(@Param('id') id: string, @Res() res: Response) {
    const media = await this.uploadsService.findOne(id);
    res.set('Content-Type', media.mimetype);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(media.data);
  }
}
