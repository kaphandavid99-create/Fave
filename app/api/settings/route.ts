import { NextRequest, NextResponse } from 'next/server';

// Mock settings storage - in production this would be your database
let settingsStorage: any = {
  general: {
    salonName: "Fave's Touch Luxury Braiding",
    businessEmail: 'info@favestouch.com',
    phoneNumber: '+1 (555) 123-4567',
    website: 'https://favestouch.com',
    address: '123 Luxury Lane, Beauty District, NY 10001',
    description: "Experience the intersection of heritage craftsmanship and modern luxury. We specialize in intricate braiding techniques that prioritize both aesthetic excellence and hair health.",
    openingTime: '09:00',
    closingTime: '18:00',
    primaryColor: '#8A4A32',
    secondaryColor: '#5C241E',
    backgroundColor: '#F7F1EC',
    textColor: '#3A241C',
  },
  notifications: {
    emailBookings: true,
    emailCustomers: true,
    emailReviews: true,
    smsBookings: false,
    smsReminders: true,
    pushNotifications: true,
  },
  payment: {},
  users: {},
  security: {},
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'general';
    
    const settings = settingsStorage[category] || {};
    
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, settings } = body;
    
    if (!category || !settings) {
      return NextResponse.json(
        { success: false, error: 'Category and settings are required' },
        { status: 400 }
      );
    }
    
    // Save settings (in production, this would be your database operation)
    settingsStorage[category] = settings;
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}