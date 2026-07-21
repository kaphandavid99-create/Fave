import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { inMemoryStorage } from '@/lib/in-memory-storage';

export async function GET(request: NextRequest) {
  try {
    // Some environments may not have `created_at` on the `gallery` table yet.
    // Try to order by created_at first; if it fails, fall back to ordering by id (or no order).
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
        // For other DB errors, use in-memory fallback so the site doesn't break.
        console.error('Error fetching gallery items, using fallback:', error);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const transformedData = inMemoryStorage.gallery.map((item: any) => ({
          id: item.id,
          styleName: item.style_name,
          length: item.length,
          color: item.color,
          image: item.image?.startsWith('/') ? `${baseUrl}${item.image}` : item.image,
          description: item.description,
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
        }));

        return NextResponse.json({
          success: true,
          data: transformedData,
          usingFallback: true,
        });
      }
    }

    // Transform snake_case to camelCase for frontend
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const transformedData = data?.map((item: any) => ({
      id: item.id,
      styleName: item.style_name,
      length: item.length,
      color: item.color,
      image: item.image?.startsWith('/') ? `${baseUrl}${item.image}` : item.image,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedData
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    
    // Fallback to in-memory storage
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const transformedData = inMemoryStorage.gallery.map((item: any) => ({
      id: item.id,
      styleName: item.style_name,
      length: item.length,
      color: item.color,
      image: item.image?.startsWith('/') ? `${baseUrl}${item.image}` : item.image,
      description: item.description,
      createdAt: item.created_at || new Date().toISOString(),
      updatedAt: item.updated_at || new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: transformedData,
      usingFallback: true
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styleName, length, color, image, description } = body;

    if (!styleName || !length || !color || !image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert({
        style_name: styleName,
        length: length,
        color: color,
        image: image,
        description: description
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding gallery item, using fallback:', error);
      
      const newItem = {
        id: inMemoryStorage.galleryNextId++,
        style_name: styleName,
        length: length,
        color: color,
        image: image,
        description: description
      };
      
      inMemoryStorage.gallery.push(newItem);

      // Transform snake_case to camelCase
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const transformedData = {
        id: newItem.id,
        styleName: newItem.style_name,
        length: newItem.length,
        color: newItem.color,
        image: newItem.image?.startsWith('/') ? `${baseUrl}${newItem.image}` : newItem.image,
        description: newItem.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: transformedData,
        message: 'Gallery item added successfully (in-memory fallback)',
        usingFallback: true
      });
    }

    // Transform snake_case to camelCase for frontend
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const transformedData = data ? {
      id: data.id,
      styleName: data.style_name,
      length: data.length,
      color: data.color,
      image: data.image?.startsWith('/') ? `${baseUrl}${data.image}` : data.image,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;

    return NextResponse.json({
      success: true,
      data: transformedData,
      message: 'Gallery item added successfully'
    });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add gallery item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, styleName, length, color, image, description } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('gallery')
      .update({
        style_name: styleName,
        length: length,
        color: color,
        image: image,
        description: description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating gallery item, using fallback:', error);
      
      const index = inMemoryStorage.gallery.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        inMemoryStorage.gallery[index] = {
          ...inMemoryStorage.gallery[index],
          style_name: styleName || inMemoryStorage.gallery[index].style_name,
          length: length || inMemoryStorage.gallery[index].length,
          color: color || inMemoryStorage.gallery[index].color,
          image: image || inMemoryStorage.gallery[index].image,
          description: description || inMemoryStorage.gallery[index].description
        };

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const transformedData = {
          id: inMemoryStorage.gallery[index].id,
          styleName: inMemoryStorage.gallery[index].style_name,
          length: inMemoryStorage.gallery[index].length,
          color: inMemoryStorage.gallery[index].color,
          image: inMemoryStorage.gallery[index].image?.startsWith('/') ? `${baseUrl}${inMemoryStorage.gallery[index].image}` : inMemoryStorage.gallery[index].image,
          description: inMemoryStorage.gallery[index].description,
          createdAt: inMemoryStorage.gallery[index].created_at,
          updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          data: transformedData,
          message: 'Gallery item updated successfully (in-memory fallback)',
          usingFallback: true
        });
      }
    }

    // Transform snake_case to camelCase
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const transformedData = data ? {
      id: data.id,
      styleName: data.style_name,
      length: data.length,
      color: data.color,
      image: data.image?.startsWith('/') ? `${baseUrl}${data.image}` : data.image,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;

    return NextResponse.json({
      success: true,
      data: transformedData,
      message: 'Gallery item updated successfully'
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery item, using fallback:', error);
      
      inMemoryStorage.gallery = inMemoryStorage.gallery.filter((item: any) => item.id !== id);

      return NextResponse.json({
        success: true,
        message: 'Gallery item deleted successfully (in-memory fallback)',
        usingFallback: true
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}