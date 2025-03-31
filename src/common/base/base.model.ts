import { Document, Schema } from 'mongoose';

export default abstract class BaseModel extends Document {
  createdAt!: Date;
  updatedAt!: Date;
}

export function applyBaseSchema<T>(schema: Schema<T>) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  });
}
