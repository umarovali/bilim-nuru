import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(@InjectModel(Teacher.name) private model: Model<TeacherDocument>) {}

  findAllPublic() {
    return this.model.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
  }

  findAllAdmin() {
    return this.model.find().sort({ order: 1, createdAt: -1 });
  }

  async findOne(id: string) {
    const teacher = await this.model.findById(id);
    if (!teacher) throw new NotFoundException('Преподаватель не найден');
    return teacher;
  }

  create(dto: CreateTeacherDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const teacher = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!teacher) throw new NotFoundException('Преподаватель не найден');
    return teacher;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Преподаватель не найден');
    return { deleted: true };
  }
}
