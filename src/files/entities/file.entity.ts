import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop()
  filename: string;

  @Prop()
  contentType: string;

  @Prop()
  length: number;

  @Prop()
  uploadDate: Date;
}

export const FileSchema = SchemaFactory.createForClass(File); 