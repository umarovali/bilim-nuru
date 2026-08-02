import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(@InjectModel(Branch.name) private model: Model<BranchDocument>) {}

  findAllPublic() {
    return this.model.find({ isActive: true }).sort({ order: 1 });
  }

  findAllAdmin() {
    return this.model.find().sort({ order: 1 });
  }

  create(dto: CreateBranchDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateBranchDto) {
    const branch = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!branch) throw new NotFoundException('Филиал не найден');
    return branch;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Филиал не найден');
    return { deleted: true };
  }
}
