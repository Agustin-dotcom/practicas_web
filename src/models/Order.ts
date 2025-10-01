import mongoose, { Schema, Types } from 'mongoose';

  export interface OrderItem {
    order: Types.ObjectId;
    qty: number;
    price: number;
  }
  
  export interface Order {
    date: Date;
    address: string;
    cardHolder: string;
    cardNumber: string;
    user: Types.ObjectId;
    orderItems: OrderItem[];
  }
  
  const OrderSchema = new Schema<Order>({
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    cardHolder: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
  });

  export default mongoose.models.Order as mongoose.Model<Order> || mongoose.model<Order>('Order', OrderSchema);