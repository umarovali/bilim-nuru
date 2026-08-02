import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './schemas/about.schema';
import { UpdateAboutDto } from './dto/update-about.dto';

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private model: Model<AboutDocument>) {}

  // Always returns (and creates if missing) the single "About us" document
  async get() {
    let about = await this.model.findOne();
    if (!about) {
      about = await this.model.create({});
    }
    return about;
  }

  async update(dto: UpdateAboutDto) {
    let about = await this.model.findOne();
    if (!about) {
      about = await this.model.create(dto);
    } else {
      Object.assign(about, dto);
      await about.save();
    }
    return about;
  }
}
