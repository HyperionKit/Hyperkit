import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const isWhitelisted = await googleSheetsService.isAddressWhitelisted(address);

    return NextResponse.json({
      isWhitelisted,
      address
    });

  } catch (error) {
    console.error('Error checking whitelist status:', error);
    return NextResponse.json(
      { error: 'Failed to check whitelist status' },
      { status: 500 }
    );
  }
}
