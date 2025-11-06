import mongoose, { Schema, Types } from 'mongoose';
  export interface Product {
    name: string;
    description: string;
    img: string;
    price: number;
    cuerpo: string;
  }
  
  
  const ProductSchema = new Schema<Product>({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cuerpo: {
      type: String,
      required: true
    }
    
  });

  export default mongoose.models.Product as mongoose.Model<Product> || mongoose.model<Product>('Product', ProductSchema);