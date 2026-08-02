import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

// Singleton document: general site info shown in Header/Footer
@Schema({ timestamps: true })
export class Settings {
  @Prop({ default: 'Билим Нуру' })
  siteName: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  instagram: string;

  @Prop({ default: '' })
  facebook: string;

  @Prop({ default: '' })
  whatsapp: string;

  @Prop({ default: '' })
  workingHours: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
