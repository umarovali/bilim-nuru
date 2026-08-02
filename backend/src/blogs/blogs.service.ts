import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private model: Model<BlogDocument>) {}

  findAllPublic() {
    return this.model.find({ isActive: true }).sort({ publishedAt: -1 });
  }

  findAllAdmin() {
    return this.model.find().sort({ publishedAt: -1 });
  }

  async findOne(id: string) {
    const blog = await this.model.findById(id);
    if (!blog) throw new NotFoundException('Статья не найдена');
    return blog;
  }

  create(dto: CreateBlogDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!blog) throw new NotFoundException('Статья не найдена');
    return blog;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Статья не найдена');
    return { deleted: true };
  }
}
