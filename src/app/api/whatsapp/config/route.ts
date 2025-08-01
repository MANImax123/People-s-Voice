import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppConfig, getConfigurationGuide } from '@/lib/whatsapp-config';

export async function GET(request: NextRequest) {
  try {
    const config = getWhatsAppConfig();
    const guide = getConfigurationGuide();

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        guide
      }
    });
  } catch (error) {
    console.error('Error checking WhatsApp configuration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check WhatsApp configuration',
        data: {
          isConfigured: false,
          primaryApi: 'Console Mode',
          hasMetaConfig: false,
          hasTwilioConfig: false
        }
      },
      { status: 500 }
    );
  }
}
