import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {
  ErrorResponse,
  updateCartItem,
  deleteCartItem,
  GetCartResponse,
} from '@/lib/handlers';

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<GetCartResponse> | NextResponse<ErrorResponse>> {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or product ID.',
      },
      { status: 400 }
    );
  }

  const body = await request.json();

  if (!body.qty || body.qty < 1) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Quantity must be greater than or equal to 1.',
      },
      { status: 400 }
    );
  }

  const result = await updateCartItem(params.userId, params.productId, body.qty);

  if (result === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or product not found.',
      },
      { status: 404 }
    );
  }

  const headers = new Headers();
  const statusCode = result.isNew ? 201 : 200;

  if (result.isNew) {
    headers.append(
      'Location',
      `/api/users/${params.userId}/cart/${params.productId}`
    );
  }

  return NextResponse.json(
    { cartItems: result.cartItems },
    { status: statusCode, headers }
  );
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<GetCartResponse> | NextResponse<ErrorResponse>> {
  if (
    !Types.ObjectId.isValid(params.userId) ||
    !Types.ObjectId.isValid(params.productId)
  ) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or product ID.',
      },
      { status: 400 }
    );
  }

  const cart = await deleteCartItem(params.userId, params.productId);

  if (cart === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or product not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(cart);
}