import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true })
  text: string; // Review text, kept as written (not translated)

  @Prop({ min: 1, max: 5, default: 5 })
  rating: number;

  @Prop({ default: '' })
  branch: string; // optional: which branch the review is about

  @Prop({ type: String, enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
