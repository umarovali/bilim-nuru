import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel(Course.name) private model: Model<CourseDocument>) {}

  findAllPublic() {
    return this.model.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  }

  findAllAdmin() {
    return this.model.find().sort({ order: 1, createdAt: -1 });
  }

  async findOne(id: string) {
    const course = await this.model.findById(id);
    if (!course) throw new NotFoundException('Курс не найден');
    return course;
  }

  create(dto: CreateCourseDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateCourseDto) {
    const course = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!course) throw new NotFoundException('Курс не найден');
    return course;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Курс не найден');
    return { deleted: true };
  }
}
