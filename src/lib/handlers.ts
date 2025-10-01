import Products, { Product } from '@/models/Product';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';
import Users, { User } from '@/models/User';
import Orders from '@/models/Order';

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
export interface GetProductResponse {
  _id: Types.ObjectId;
  name: string;
  description: string;
  img: string;
  price: number;
}
export interface GetCartResponse {
  cartItems: Array<{
    product: Product & { _id: Types.ObjectId };
    qty: number;
  }>;
}
export interface GetOrdersResponse {
  orders: Array<{
    _id: Types.ObjectId;
    address: string;
    date: Date;
    cardHolder: string;
    cardNumber: string;
    orderItems: Array<{
      product: Types.ObjectId;
      qty: number;
      price: number;
    }>;
  }>;
}
export interface GetOrderResponse {
  _id: Types.ObjectId;
  address: string;
  date: Date;
  cardHolder: string;
  cardNumber: string;
  orderItems: Array<{
    product: Product & { _id: Types.ObjectId };
    qty: number;
    price: number;
  }>;
}
export interface CreateOrderResponse {
  _id: Types.ObjectId;
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

// GET /api/products/[productId]
export async function getProduct(
  productId: Types.ObjectId | string
): Promise<GetProductResponse | null> {
  await connect();

  const productProjection = {
    __v: false,
  };
  const product = await Products.findById(productId, productProjection);

  return product;
}

// GET /api/users/[userId]/cart
export async function getUserCart(
  userId: Types.ObjectId | string
): Promise<GetCartResponse | null> {
  await connect();

  const user = await Users.findById(userId).populate({
    path: 'cartItems.product',
    select: '-__v',
  });

  if (!user) {
    return null;
  }

  return {
    cartItems: user.cartItems as any, // populated products
  };
}

// PUT /api/users/[userId]/cart/[productId]
export async function updateCartItem(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  qty: number
): Promise<{ cartItems: any[]; isNew: boolean } | null> {
  await connect();

  // Verify product exists
  const product = await Products.findById(productId);
  if (!product) {
    return null;
  }

  // Find user
  const user = await Users.findById(userId);
  if (!user) {
    return null;
  }

  // Check if product already in cart
  const existingItemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  let isNew = false;

  if (existingItemIndex >= 0) {
    // Update existing item
    user.cartItems[existingItemIndex].qty = qty;
  } else {
    // Add new item
    user.cartItems.push({
      product: new Types.ObjectId(productId),
      qty,
    });
    isNew = true;
  }

  await user.save();

  // Populate and return cart
  const updatedUser = await Users.findById(userId).populate({
    path: 'cartItems.product',
    select: '-__v',
  });

  return {
    cartItems: updatedUser!.cartItems as any,
    isNew,
  };
}

// DELETE /api/users/[userId]/cart/[productId]
export async function deleteCartItem(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string
): Promise<GetCartResponse | null> {
  await connect();

  // Verify product exists
  const product = await Products.findById(productId);
  if (!product) {
    return null;
  }

  // Find user and remove item
  const user = await Users.findById(userId);
  if (!user) {
    return null;
  }

  // Filter out the product
  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await user.save();

  // Populate and return cart
  const updatedUser = await Users.findById(userId).populate({
    path: 'cartItems.product',
    select: '-__v',
  });

  return {
    cartItems: updatedUser!.cartItems as any,
  };
}

// GET /api/users/[userId]/orders
export async function getUserOrders(
  userId: Types.ObjectId | string
): Promise<GetOrdersResponse | null> {
  await connect();

  const user = await Users.findById(userId).populate({
    path: 'orders',
    select: '-__v',
  });

  if (!user) {
    return null;
  }

  return {
    orders: user.orders as any, // populated orders
  };
}

// POST /api/users/[userId]/orders
export async function createOrder(
  userId: Types.ObjectId | string,
  orderData: {
    address: string;
    cardHolder: string;
    cardNumber: string;
  }
): Promise<CreateOrderResponse | null> {
  await connect();

  // Find user with populated cart
  const user = await Users.findById(userId).populate('cartItems.product');

  if (!user) {
    return null;
  }

  // Check if cart is empty
  if (user.cartItems.length === 0) {
    return null;
  }

  // Transform cart items to order items (with price snapshot)
  const orderItems = user.cartItems.map((cartItem) => {
    const product = cartItem.product as any; // populated
    return {
      product: product._id,
      qty: cartItem.qty,
      price: product.price, // snapshot current price
    };
  });

  // Create the order
  const newOrder = await Orders.create({
    address: orderData.address,
    cardHolder: orderData.cardHolder,
    cardNumber: orderData.cardNumber,
    date: new Date(), // server-generated
    orderItems,
  });

  // Add order to user's orders array
  user.orders.push(newOrder._id);

  // Clear the cart
  user.cartItems = [];

  await user.save();

  return {
    _id: newOrder._id,
  };
}

// GET /api/users/[userId]/orders/[orderId]
export async function getUserOrder(
  userId: Types.ObjectId | string,
  orderId: Types.ObjectId | string
): Promise<GetOrderResponse | null> {
  await connect();

  // Find user
  const user = await Users.findById(userId);
  if (!user) {
    return null;
  }

  // Check if order belongs to user
  const orderBelongsToUser = user.orders.some(
    (orderRef) => orderRef.toString() === orderId.toString()
  );

  if (!orderBelongsToUser) {
    return null;
  }

  // Find and populate order
  const order = await Orders.findById(orderId).populate({
    path: 'orderItems.product',
    select: '-__v',
  });

  if (!order) {
    return null;
  }

  return order as any; // with populated products
}