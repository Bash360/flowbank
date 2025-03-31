import { model, Schema } from 'mongoose';

import BaseModel, { applyBaseSchema } from '../../../common/base/base.model';

export interface User extends BaseModel {
  password: string;
  email: string;
}

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
applyBaseSchema(UserSchema);

const UserModel = model<User>('User', UserSchema);

export default UserModel;
