import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewStatus } from './schemas/review.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Public: GET /reviews -> approved reviews only, shown on the landing page
  @Get()
  findApproved() {
    return this.reviewsService.findApproved();
  }

  // Public: POST /reviews -> submit a new review, goes to "pending" for moderation
  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  // Admin: GET /reviews/admin/all?status=pending -> all reviews for moderation
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllAdmin(@Query('status') status?: ReviewStatus) {
    return this.reviewsService.findAllAdmin(status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.reviewsService.setStatus(id, ReviewStatus.APPROVED);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.reviewsService.setStatus(id, ReviewStatus.REJECTED);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
