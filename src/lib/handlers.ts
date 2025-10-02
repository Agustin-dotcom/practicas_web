import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';
import Users, { User } from '@/models/User';
export interface ErrorResponse {
  error: string
  message: string
}
export interface GetProductsResponse {
  products: (Product & { _id: Types.ObjectId })[]
}
export interface GetProductResponse {
  product: (Product & { _id: Types.ObjectId })
}
export interface GetUserResponse
  extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId
}
export interface CreateUserResponse {
  _id: Types.ObjectId
}
export interface GetCartItemsResponse{
cartItems: {
    product:Types.ObjectId ;
    qty: number;
  }[];
}
export interface PutNumberOfItemsResponse{
  cartItems: {
    product:Types.ObjectId ;
    qty: number;
  }[];
}
export async function getProducts(): Promise<GetProductsResponse> {
  await connect()

  const productsProjection = {
    __v: false
  }
  const products = await Products.find({}, productsProjection)

  return {
    products,
  }
}


export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}



export async function getUser(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> {
  await connect()

  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  }
  const user = await Users.findById(userId, userProjection)

  return user
}

export async function productExists(
  productId: Types.ObjectId | string
): Promise<boolean> {
  
  const product = await Products.exists({_id:productId})

  return !!product
}

export async function isProductInCart(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string
): Promise<boolean> {
  

  const user = await Users.findOne({
    _id: userId,
    "cartItems.product": productId
  }).select("_id");

  return !!user
}

export async function getCartItems(
  userId: Types.ObjectId | string
): Promise<GetCartItemsResponse>{
  await connect();

  const user = await Users.findById(userId)
    .populate("cartItems.product")
    .select("cartItems");

  return {
    cartItems: user?.cartItems ?? [],
  };
}


export async function putNumberOfItems(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  quantity: number
):Promise<PutNumberOfItemsResponse>{
  // Paso 1: buscamos al usuario
  const user = await Users.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Paso 2: buscamos si ya tiene el producto
  interface CartItem {
    product: Types.ObjectId;
    qty: number;
  }
  const existingItem = user.cartItems.find(
    (item: CartItem) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    // ✅ si existe, actualizamos la cantidad
    existingItem.qty = quantity;
  } else {
    // ➕ si no existe, lo agregamos
    user.cartItems.push({
      product: new Types.ObjectId(productId),
      qty
    });
  }

  await user.save();
  return user.cartItems;
}