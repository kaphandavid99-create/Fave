import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { inMemoryStorage } from '@/lib/in-memory-storage';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get('style');
  const length = searchParams.get('length');
  const color = searchParams.get('color');

  try {
    // Directly fetch from database (same logic as gallery-admin)
    let query = supabase.from('gallery').select('*');

    try {
      query = query.order('created_at', { ascending: false });
    } catch {
      // ignore and retry without created_at ordering
    }

    let data: any[] | null = null;
    let error: any = null;

    try {
      const result = await query;
      data = result?.data ?? null;
      error = result?.error ?? null;
    } catch (err: any) {
      error = err;
      data = null;
    }

    if (error) {
      // If created_at ordering fails due to missing column, retry without it.
      const message = String(error?.message || error);
      const createdAtMissing =
        message.toLowerCase().includes('created_at') && (message.toLowerCase().includes('column') || message.toLowerCase().includes('does not exist'));

      if (createdAtMissing) {
        const result2 = await supabase
          .from('gallery')
          .select('*')
          .order('id', { ascending: false });

        data = (result2?.data as any[]) || [];
      } else {
        // For other DB errors, use in-memory fallback
        console.error('Error fetching gallery items, using fallback:', error);
        data = null;
      }
    }

    let galleryData: any[] = [];

    if (data) {
      // Transform snake_case to camelCase for frontend
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      galleryData = data.map((item: any) => ({
        id: item.id,
        styleName: item.style_name,
        length: item.length,
        color: item.color,
        image: item.image?.startsWith('/') ? `${baseUrl}${item.image}` : item.image,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } else {
      // Use in-memory fallback
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      galleryData = inMemoryStorage.gallery.map((item: any) => ({
        id: item.id,
        styleName: item.style_name,
        length: item.length,
        color: item.color,
        image: item.image?.startsWith('/') ? `${baseUrl}${item.image}` : item.image,
        description: item.description,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));
    }

    // Apply filters if provided
    if (style && style !== 'All styles') {
      galleryData = galleryData.filter((item: any) => item.styleName === style);
    }
    if (length && length !== 'All lengths') {
      galleryData = galleryData.filter((item: any) => item.length === length);
    }
    if (color && color !== 'All colors') {
      galleryData = galleryData.filter((item: any) => item.color === color);
    }

    return NextResponse.json({
      success: true,
      data: galleryData,
      total: galleryData.length,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);

    // Fallback to in-memory storage if database fails
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const galleryData = inMemoryStorage.gallery.map((item: any) => ({
      id: item.id,
      styleName: item.style_name,
      length: item.length,
      color: item.color,
      image: item.image?.startsWith('/') ? `${baseUrl}${item.image}` : item.image,
      description: item.description,
    }));

    return NextResponse.json({
      success: true,
      data: galleryData,
      total: galleryData.length,
      usingFallback: true,
    });
  }
}

