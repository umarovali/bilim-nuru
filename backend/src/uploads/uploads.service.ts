import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from './schemas/media.schema';

@Injectable()
export class UploadsService {
  constructor(@InjectModel(Media.name) private model: Model<MediaDocument>) {}

  async save(file: Express.Multer.File) {
    return this.model.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
    });
  }

  async findOne(id: string) {
    const media = await this.model.findById(id);
    if (!media) throw new NotFoundException('Файл не найден');
    return media;
  }
}
