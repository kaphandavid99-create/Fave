import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET() {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const todayStr = today.toISOString().split('T')[0];

    // Get today's visits
    const { data: todayVisits, error: todayError } = await supabaseAdmin
      .from('page_visits')
      .select('id')
      .eq('visit_date', todayStr);

    // Get this month's visits
    const { data: monthVisits, error: monthError } = await supabaseAdmin
      .from('page_visits')
      .select('id')
      .eq('visit_month', currentMonthStr);

    // Get this year's visits
    const { data: yearVisits, error: yearError } = await supabaseAdmin
      .from('page_visits')
      .select('id')
      .eq('visit_year', currentYear);

    // Get unique visitors today (by session_id)
    const { data: todayUnique, error: todayUniqueError } = await supabaseAdmin
      .from('page_visits')
      .select('session_id')
      .eq('visit_date', todayStr);

    // Get unique visitors this month
    const { data: monthUnique, error: monthUniqueError } = await supabaseAdmin
      .from('page_visits')
      .select('session_id')
      .eq('visit_month', currentMonthStr);

    // Get unique visitors this year
    const { data: yearUnique, error: yearUniqueError } = await supabaseAdmin
      .from('page_visits')
      .select('session_id')
      .eq('visit_year', currentYear);

    // Get unique authenticated users (by clerk_user_id)
    const { data: todayAuthUsers, error: todayAuthError } = await supabaseAdmin
      .from('page_visits')
      .select('clerk_user_id')
      .eq('visit_date', todayStr)
      .not('clerk_user_id', 'is', null);

    const { data: monthAuthUsers, error: monthAuthError } = await supabaseAdmin
      .from('page_visits')
      .select('clerk_user_id')
      .eq('visit_month', currentMonthStr)
      .not('clerk_user_id', 'is', null);

    const { data: yearAuthUsers, error: yearAuthError } = await supabaseAdmin
      .from('page_visits')
      .select('clerk_user_id')
      .eq('visit_year', currentYear)
      .not('clerk_user_id', 'is', null);

    // Get last 7 days trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const { data: dayVisits } = await supabaseAdmin
        .from('page_visits')
        .select('id')
        .eq('visit_date', dateStr);

      const { data: dayUnique } = await supabaseAdmin
        .from('page_visits')
        .select('session_id')
        .eq('visit_date', dateStr);

      last7Days.push({
        date: dateStr,
        totalVisits: dayVisits?.length || 0,
        uniqueVisitors: new Set(dayUnique?.map((v: any) => v.session_id)).size,
      });
    }

    // Get monthly trend for current year
    const monthlyTrend = [];
    for (let i = 1; i <= 12; i++) {
      const monthStr = `${currentYear}-${String(i).padStart(2, '0')}`;
      
      const { data: monthVisitsData } = await supabaseAdmin
        .from('page_visits')
        .select('id')
        .eq('visit_month', monthStr);

      const { data: monthUniqueData } = await supabaseAdmin
        .from('page_visits')
        .select('session_id')
        .eq('visit_month', monthStr);

      monthlyTrend.push({
        month: monthStr,
        totalVisits: monthVisitsData?.length || 0,
        uniqueVisitors: new Set(monthUniqueData?.map((v: any) => v.session_id)).size,
      });
    }

    // Calculate unique visitors by counting distinct session_ids
    const todayUniqueCount = new Set(todayUnique?.map((v: any) => v.session_id)).size;
    const monthUniqueCount = new Set(monthUnique?.map((v: any) => v.session_id)).size;
    const yearUniqueCount = new Set(yearUnique?.map((v: any) => v.session_id)).size;

    // Calculate authenticated users by counting distinct clerk_user_ids
    const todayAuthCount = new Set(todayAuthUsers?.map((v: any) => v.clerk_user_id)).size;
    const monthAuthCount = new Set(monthAuthUsers?.map((v: any) => v.clerk_user_id)).size;
    const yearAuthCount = new Set(yearAuthUsers?.map((v: any) => v.clerk_user_id)).size;

    return NextResponse.json({
      success: true,
      data: {
        today: {
          totalVisits: todayVisits?.length || 0,
          uniqueVisitors: todayUniqueCount,
          authenticatedUsers: todayAuthCount,
        },
        month: {
          totalVisits: monthVisits?.length || 0,
          uniqueVisitors: monthUniqueCount,
          authenticatedUsers: monthAuthCount,
        },
        year: {
          totalVisits: yearVisits?.length || 0,
          uniqueVisitors: yearUniqueCount,
          authenticatedUsers: yearAuthCount,
        },
        trends: {
          last7Days,
          monthly: monthlyTrend,
        },
      },
    });
  } catch (e: any) {
    console.error('Error in visit statistics:', e);
    return NextResponse.json(
      {
        success: false,
        error: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}
