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