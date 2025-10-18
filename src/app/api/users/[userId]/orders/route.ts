import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {
  ErrorResponse,
  getUserOrders,
  GetOrdersResponse,
  createOrder,
  CreateOrderResponse,
} from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<GetOrdersResponse> | NextResponse<ErrorResponse>> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    );
  }

  const orders = await getUserOrders(params.userId);

  if (orders === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(orders);
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
): Promise<NextResponse<CreateOrderResponse> | NextResponse<ErrorResponse>> {
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    );
  }

  const body = await request.json();

  if (!body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Request parameters are wrong or missing.',
      },
      { status: 400 }
    );
  }

  const order = await createOrder(params.userId, {
    address: body.address,
    cardHolder: body.cardHolder,
    cardNumber: body.cardNumber,
  });

  if (order === 0) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'User not found',
      },
      { status: 404 }
    );
  }
  if (order == 1) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Cart is empty.',
      },
      { status: 400 }
    );
  }

  const headers = new Headers();
  headers.append('Location', `/api/users/${params.userId}/orders/${(order as CreateOrderResponse)._id}`);

  return NextResponse.json(order as CreateOrderResponse, { status: 201, headers });
}