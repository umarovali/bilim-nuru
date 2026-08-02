import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument, ReviewStatus } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private model: Model<ReviewDocument>) {}

  // Public: only approved reviews are shown on the landing page
  findApproved() {
    return this.model.find({ status: ReviewStatus.APPROVED }).sort({ createdAt: -1 });
  }

  // Admin: all reviews, optionally filtered by status (pending/approved/rejected)
  findAllAdmin(status?: ReviewStatus) {
    const filter = status ? { status } : {};
    return this.model.find(filter).sort({ createdAt: -1 });
  }

  // Public: new review always starts as "pending" until an admin approves it
  create(dto: CreateReviewDto) {
    return this.model.create({ ...dto, status: ReviewStatus.PENDING });
  }

  async setStatus(id: string, status: ReviewStatus) {
    const review = await this.model.findByIdAndUpdate(id, { status }, { new: true });
    if (!review) throw new NotFoundException('Отзыв не найден');
    return review;
  }

  async remove(id: string) {
    const result = await this.model.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Отзыв не найден');
    return { deleted: true };
  }
}
