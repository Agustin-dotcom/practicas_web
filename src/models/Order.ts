// src/models/Order.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface OrderItem {
  product: Types.ObjectId;   // ref Product
  qty: number;               // >= 1
  price: number;             // snapshot at purchase time
}

export interface Order {
  address: string;
  cardHolder: string;
  cardNumber: string;
  date: Date;                // set by server
  orderItems: OrderItem[];
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty:     { type: Number, required: true, min: 1 },
    price:   { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    address:    { type: String, required: true },
    cardHolder: { type: String, required: true },
    cardNumber: { type: String, required: true },
    date:       { type: Date,   required: true, default: () => new Date() },
    orderItems: { type: [OrderItemSchema], required: true, default: [] },
  },
  { timestamps: false }
);

export default (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>('Order', OrderSchema);
