import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
  try {
    const { address, walletType, timestamp } = await request.json();

    if (!address || !walletType) {
      return NextResponse.json(
        { error: 'Wallet address and type are required' },
        { status: 400 }
      );
    }

    // Check if user is already whitelisted
    const isAlreadyWhitelisted = await googleSheetsService.isAddressWhitelisted(address);
    
    if (isAlreadyWhitelisted) {
      return NextResponse.json({
        success: false,
        error: 'Wallet address is already whitelisted',
        isWhitelisted: true
      });
    }

    // Add user to whitelist in Google Sheets
    const success = await googleSheetsService.addToWhitelist({
      address,
      walletType,
      timestamp,
      joinedAt: new Date().toISOString()
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Successfully joined whitelist',
        address
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to add to whitelist'
      });
    }

  } catch (error) {
    console.error('Error joining whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to join whitelist' },
      { status: 500 }
    );
  }
}
