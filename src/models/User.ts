// src/models/User.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface CartItem {
  product: Types.ObjectId; // ref: Product
  qty: number;             // >= 1
}

export interface User {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
  cartItems: CartItem[];
  orders: Types.ObjectId[]; // refs: Order[]
}

const CartItemSchema = new Schema<CartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const UserSchema = new Schema<User>({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name:     { type: String, required: true },
  surname:  { type: String, required: true },
  address:  { type: String, required: true },
  birthdate:{ type: Date,   required: true },

  // Important: start EMPTY per the spec
  cartItems: { type: [CartItemSchema], default: [] },
  orders:    { type: [{ type: Schema.Types.ObjectId, ref: 'Order' }], default: [] },
});

export default (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);
