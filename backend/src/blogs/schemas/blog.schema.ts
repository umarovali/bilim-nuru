import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  excerpt: string; // short preview text

  @Prop({ required: true })
  content: string; // full article text

  @Prop({ default: '' })
  coverImage: string;

  @Prop({ default: Date.now })
  publishedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
