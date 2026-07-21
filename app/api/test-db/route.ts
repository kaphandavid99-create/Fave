import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    
    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('services')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Database connection error:', testError);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: testError.message 
      });
    }

    // Test 2: Check table structure
    const { data: columns, error: columnsError } = await supabase
      .from('services')
      .select('*')
      .limit(0);

    if (columnsError) {
      console.error('Table structure error:', columnsError);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Could not check table structure',
        error: columnsError.message 
      });
    }

    // Test 3: Try to insert a simple test service
    const testService = {
      name: 'Test Service ' + Date.now(),
      price: 100,
      duration: 60,
      is_featured: false
    };

    const { data: insertData, error: insertError } = await supabase
      .from('services')
      .insert([testService])
      .select()
      .single();

    if (insertError) {
      console.error('Insert test error:', insertError);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to insert test service',
        error: insertError.message,
        details: insertError
      });
    }

    // Clean up test service
    if (insertData?.id) {
      await supabase.from('services').delete().eq('id', insertData.id);
    }

    console.log('=== DATABASE TEST SUCCESSFUL ===');
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection and basic operations working correctly',
      testServiceId: insertData?.id
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Unexpected error during database test',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}