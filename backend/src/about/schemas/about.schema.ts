import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AboutDocument = About & Document;

// Singleton document: only one "About us" record exists
@Schema({ timestamps: true })
export class About {
  @Prop({ default: 'Билим Нуру' })
  title: string;

  @Prop({ default: '' })
  text: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ default: 0 })
  studentsCount: number;

  @Prop({ default: 0 })
  teachersCount: number;

  @Prop({ default: 0 })
  coursesCount: number;

  @Prop({ default: 0 })
  yearsOnMarket: number;
}

export const AboutSchema = SchemaFactory.createForClass(About);
