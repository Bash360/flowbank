import { model, Schema } from 'mongoose';

import BaseModel, { applyBaseSchema } from '../../../common/base/base.model';

export interface Example extends BaseModel {
  userId: string;
  amount: number;
}

const ExampleSchema = new Schema<Example>(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);
applyBaseSchema(ExampleSchema);

const ExampleModel = model<Example>('Example', ExampleSchema);

export default ExampleModel;
